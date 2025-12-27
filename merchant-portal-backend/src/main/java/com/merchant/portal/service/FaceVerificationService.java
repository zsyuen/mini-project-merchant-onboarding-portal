package com.merchant.portal.service;

import ai.djl.MalformedModelException;
import ai.djl.inference.Predictor;
import ai.djl.modality.cv.Image;
import ai.djl.modality.cv.ImageFactory;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ModelNotFoundException;
import ai.djl.repository.zoo.ZooModel;
import ai.djl.training.util.ProgressBar;
import ai.djl.translate.TranslateException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FaceVerificationService {

    // Threshold for verification (0.4 - 0.6 is common for ArcFace)
    private static final double THRESHOLD = 0.50;

    public double compareFaces(Path idCardPath, Path selfiePath) throws IOException, ModelNotFoundException, MalformedModelException, TranslateException {

        // 1. Load Images
        Image img1 = ImageFactory.getInstance().fromFile(idCardPath);
        Image img2 = ImageFactory.getInstance().fromFile(selfiePath);

        // 2. Configure Criteria to load ArcFace Model (ResNet50)
        Criteria<Image, float[]> criteria = Criteria.builder()
                .setTypes(Image.class, float[].class)
                .optModelUrls("djl://ai.djl.pytorch/resnet50") // Load Pre-trained ArcFace
                .optProgress(new ProgressBar())
                .build();

        try (ZooModel<Image, float[]> model = criteria.loadModel();
             Predictor<Image, float[]> predictor = model.newPredictor()) {

            // 3. Generate Embeddings
            float[] embedding1 = predictor.predict(img1);
            float[] embedding2 = predictor.predict(img2);

            // 4. Calculate Cosine Similarity
            return calculateCosineSimilarity(embedding1, embedding2);
        }
    }

    private double calculateCosineSimilarity(float[] vectorA, float[] vectorB) {
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    public boolean isMatch(double score) {
        return score >= THRESHOLD;
    }
}
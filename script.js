async function predictHeartDisease() {
    const resultDiv = document.getElementById('result');
    const btn = document.getElementById('predictBtn');
    
    // Show smooth loading animation
    resultDiv.classList.remove('hidden');
    resultDiv.style.display = "block";
    resultDiv.innerHTML = "<span style='font-size: 20px;'>⌛</span> Analyzing Data...";
    resultDiv.style.backgroundColor = "#f1f2f6";
    resultDiv.style.color = "#2f3542";
    resultDiv.style.border = "none";
    
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.innerHTML = "Processing...";

    // Collect dynamic data from inputs
    const features = [
        parseFloat(document.getElementById('age').value) || 0,
        parseFloat(document.getElementById('sex').value) || 0,
        parseFloat(document.getElementById('cp').value) || 0,
        parseFloat(document.getElementById('trestbps').value) || 0,
        parseFloat(document.getElementById('chol').value) || 0,
        parseFloat(document.getElementById('fbs').value) || 0,
        parseFloat(document.getElementById('restecg').value) || 0,
        parseFloat(document.getElementById('thalach').value) || 0,
        parseFloat(document.getElementById('exang').value) || 0,
        parseFloat(document.getElementById('oldpeak').value) || 0,
        parseFloat(document.getElementById('slope').value) || 0,
        parseFloat(document.getElementById('ca').value) || 0,
        parseFloat(document.getElementById('thal').value) || 0
    ];

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ features: features })
        });

        const data = await response.json();
        
        // Add a tiny delay to make it feel like real AI processing
        setTimeout(() => {
            if(data.success) {
                if(data.prediction == 1) {
                    resultDiv.innerHTML = "⚠️ High Risk of Heart Disease Detected!";
                    resultDiv.style.backgroundColor = "#ffcccc";
                    resultDiv.style.color = "#c0392b";
                    resultDiv.style.border = "2px solid #ff4d4d";
                } else {
                    resultDiv.innerHTML = "✅ Patient is Safe: Low Risk Detected.";
                    resultDiv.style.backgroundColor = "#ccffcc";
                    resultDiv.style.color = "#27ae60";
                    resultDiv.style.border = "2px solid #2ecc71";
                }
            } else {
                resultDiv.innerHTML = "❌ Prediction Error Occurred.";
            }
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.innerHTML = "Analyze Patient Data";
        }, 800); // 800ms delay for premium feel

    } catch (error) {
        resultDiv.innerHTML = "🔌 Server Disconnected! Start Node.js Server.";
        resultDiv.style.backgroundColor = "#ffeaa7";
        resultDiv.style.color = "#d63031";
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.innerHTML = "Analyze Patient Data";
    }
}
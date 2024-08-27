// Create a new file: static/dashboard.js

function fetchDashboardData() {
    Promise.all([
        fetch('/stats').then(response => response.json()),
        fetch('/feedback/analysis').then(response => response.json())
    ]).then(([stats, feedbackAnalysis]) => {
        createPerformanceChart(stats);
        createFeedbackChart(feedbackAnalysis);
        createSentimentDistributionChart(feedbackAnalysis.sentiment_distribution);
    }).catch(error => console.error('Error fetching dashboard data:', error));
}

function createPerformanceChart(stats) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Requests', 'Avg. Processing Time (s)', 'Error Rate (%)'],
            datasets: [{
                label: 'Performance Metrics',
                data: [stats.total_requests, stats.average_processing_time, stats.error_rate * 100],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createFeedbackChart(feedbackAnalysis) {
    const ctx = document.getElementById('feedbackChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Accurate', 'Inaccurate'],
            datasets: [{
                data: [feedbackAnalysis.average_accuracy * 100, (1 - feedbackAnalysis.average_accuracy) * 100],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)']
            }]
        },
        options: {
            title: {
                display: true,
                text: 'User Feedback on Accuracy'
            }
        }
    });
}

function createSentimentDistributionChart(sentimentDistribution) {
    const ctx = document.getElementById('sentimentDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(sentimentDistribution),
            datasets: [{
                data: Object.values(sentimentDistribution).map(v => v * 100),
                backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)']
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Sentiment Distribution'
            }
        }
    });
}

fetchDashboardData();
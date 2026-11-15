pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build React Application') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            echo 'CloudResQ frontend build completed successfully!'
        }
        failure {
            echo 'CloudResQ frontend build failed!'
        }
    }
}

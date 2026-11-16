
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

        stage('Deploy to CloudResQ EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'cloudresq-ssh',
                        keyFileVariable: 'SSH_KEY'
                    )
                ]) {
                    sh '''
                        mkdir -p ~/.ssh
                        ssh-keyscan -H 172.31.8.74 >> ~/.ssh/known_hosts
                        scp -i "$SSH_KEY" -r dist/. ubuntu@172.31.8.74:/var/www/html/
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'CloudResQ build and deployment completed successfully!'
        }
        failure {
            echo 'CloudResQ pipeline failed!'
        }
    }
}

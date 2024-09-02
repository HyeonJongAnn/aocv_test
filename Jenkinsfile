pipeline {
    agent any

    stages {
        stage('Build Spring Boot') {
            steps {
                dir('aocv_backend/aocv_back') {
                    sh 'mvn clean package'
                }
            }
        }

        stage('Build React App') {
            steps {
                dir('aocv/aocv_front') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
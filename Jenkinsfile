pipeline {
    agent any

    stages {
        stage('Build Spring Boot') {
            steps {
                dir('aocv_back1') { // Gradle 빌드를 실행할 디렉토리
                    sh './gradlew clean build' // Gradle Wrapper 사용하여 빌드
                }
            }
        }

        stage('Build React App') {
            steps {
                dir('aocv_front') {
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
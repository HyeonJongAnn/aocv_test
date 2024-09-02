pipeline {
    agent any

    stages {
        stage('Build Spring Boot') {
            steps {
                dir('aocv_back1') {
                    sh 'chmod +x gradlew' // 실행 권한 부여
                    sh './gradlew clean build'
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
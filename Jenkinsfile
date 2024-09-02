pipeline {
    agent any

    stages {
       stage('Build Spring Boot') {
    steps {
        dir('aocv_back1') {
            sh 'gradle clean build'
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
pipeline {
  agent any

  environment {
    REACT_DIR = 'studentMasterFront/student_manster'
    SPRING_DIR = 'studentMaster'
  }

  tools {
    nodejs 'NodeJS_18'         // You must configure NodeJS in Jenkins tools
    maven 'Maven_3.9'          // Or use Gradle if needed
  }

  stages {
    stage('Clone with Submodules') {
      steps {
        git url: 'git@github.com:jagadeeswari-saranraj/studentMasterFront.git', submoduleCfg: [], changelog: false, poll: false
        sh 'git submodule update --init --recursive'
      }
    }

    stage('Build React') {
      steps {
        dir("${REACT_DIR}") {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('Build Spring Boot') {
      steps {
        dir("${SPRING_DIR}") {
          sh 'mvn clean package -DskipTests'
          // For Gradle: sh './gradlew build'
        }
      }
    }

    // Optional Docker Image build
    stage('Build Docker Images') {
      steps {
        script {
          sh 'docker build -t react-app ./frontend'
          sh 'docker build -t springboot-app ./backend'
        }
      }
    }

    // Optional run containers
    stage('Run Containers') {
      steps {
        sh 'docker run -d -p 8080:8080 springboot-app'
        sh 'docker run -d -p 3000:3000 react-app'
      }
    }
  }

  post {
    success {
      echo 'Build and Deployment successful!'
    }
    failure {
      echo 'Something went wrong!'
    }
  }
}
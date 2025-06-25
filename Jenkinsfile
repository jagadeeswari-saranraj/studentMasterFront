pipeline {
  agent any

  environment {
    REACT_DIR = 'student_manster'
    SPRING_DIR = 'studentMaster'
  }

  tools {
    jdk 'JDK_21'
    nodejs 'NodeJS_22.14.0'         // You must configure NodeJS in Jenkins tools
    maven 'Maven_3.9.0'
  }

  stages {
    // stage('Clean Workspace') {
    //     steps {
    //         cleanWs()
    //     }
    // }

    stage('Clone with Submodules') {
      steps {
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/main']],
            userRemoteConfigs: [[url: 'https://github.com/jagadeeswari-saranraj/studentMasterFront.git']],
            extensions: [[$class: 'SubmoduleOption', recursiveSubmodules: true]]
        ])
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
          sh 'pwd'
          sh 'docker build -t jagadeeswari/student-react-app:v1 ./student_manster'
          sh 'docker build -t jagadeeswari/student-spring-app:v1 ./studentMaster'
        }
      }
    }

    // Optional run containers
    stage('Run Containers') {
      steps {
        sh 'docker run -d -p 8080:8080 jagadeeswari/student-react-app:v1'
        sh 'docker run -d -p 3000:3000 jagadeeswari/student-spring-app:v1'
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
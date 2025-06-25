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
    stage('Check Branch') {
      when {
        anyOf {
          branch 'main'
          expression {
            // Allow build for any branch
            return true
          }
        }
      }
      steps {
        echo "Running build for branch: ${env.GIT_BRANCH}"
      }
    }

    stage('Clean Workspace') {
        steps {
            cleanWs()
        }
    }

    stage('Clone with Submodules') {
      steps {
        checkout([
            $class: 'GitSCM',
            branches: [[name: '*/main']],
            userRemoteConfigs: [[url: 'https://github.com/jagadeeswari-saranraj/studentMasterFront.git']],
            extensions: [[$class: 'SubmoduleOption', recursiveSubmodules: true, trackingSubmodules: true]]
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

    stage('Stop Old Containers') {
      steps {
        script {
          sh '''
              docker rm -f student-react-app || true
              docker rm -f student-spring-app || true
              docker rm -f student-mysql || true
              docker network rm student-network || true
          '''
        }
      }
    }

    stage('Create Docker Network') {
      steps {
        script {
          sh '''
              docker network create sudent-network
          '''
        }
      }
    }

    // Optional Docker Image build
    stage('Build Docker Images') {
      steps {
        script {
          sh 'docker build -t jagadeeswari/student-react-app:v1 ./student_manster'
          sh 'docker build -t jagadeeswari/student-spring-app:v1 ./studentMaster'
        }
      }
    }

    // Start MySql
    stage('Start MySQL Container') {
      steps {
        script {
          sh '''
            docker run -d --name student-mysql --network sudent-network -e MYSQL_ALLOW_EMPTY_PASSWORD=true -e MYSQL_DATABASE=student_master -p 3306:3306 mysql:8
            sleep 40  # Give MySQL some time to initialize
          '''
        }
      }
    }

    // Optional run containers
    stage('Run Containers') {
      steps {
        sh 'docker run -d --name student-react-app --network sudent-network -p 8081:8080 jagadeeswari/student-react-app:v1'
        sh 'docker run -d --name student-spring-app --network sudent-network -p 3000:3000 jagadeeswari/student-spring-app:v1'
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
#include <Servo.h>

Servo servo1;

void setup() {  
//    pinMode(1,OUTPUT);
//    pinMode(0,OUTPUT);
    servo1.attach(14); //analog pin 0
//    servo1.writeMicroseconds(1500000000);
    Serial.begin(115200);
}

void loop() {
    if(Serial.available() > 0 && servo1.attached()) {
      char x = Serial.read();
      Serial.println(x);
      switch(x) {
        case 0:    setToZero();              break;
        case 1:    setTo180();               break;
        case '0':  setToZero();              break;
        case '1':  setTo180();               break;
        default:                             break;
      }
    }
}

void setToZero() {
 Serial.println(8);
  servo1.write(10);
  delay(15);
}

void setTo180() {
  Serial.println(9);
  servo1.write(30);
  delay(15);
}

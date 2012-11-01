#include <Servo.h>


bool debug = false;

Servo servo1;
int pos1 = 0;
int current1;
Servo servo2;
Servo servo3;
Servo servo4;

void setup() {  
    Serial.begin(115200);
}

void loop() {
    if(Serial.available() > 0) {
      char x = Serial.read();
      Serial.println(x);
      servo1.attach(9);
      delay(1000);
      switch(x) {
        case 0:  setToZero(9);              break;
        case 1:  setTo180(9);               break;
        case '0':  setToZero(9);              break;
        case '1':  setTo180(9);               break;
        default:                           break;
      }
    }else{
       servo1.detach();
    } 
}
void process(char x) {
  //Serial.println(x);

}

void setToZero(int p) {
 Serial.println(8);
  servo1.write(0);
  delay(15);
}

void setTo180(int p) {
  Serial.println(9);
  servo1.write(180);
  delay(15);
}

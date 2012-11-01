void setup() {  
  pinMode(7,OUTPUT);
  Serial.begin(115200);
}

void loop() {
    if(Serial.available() > 0) {
      char x = Serial.read();
      Serial.println(x);
      switch(x) {
        case '1':    relayOneOn();               break;
        case '5':    relayOneOff();              break;
        default:                                 break;
      }
    } 
}

void relayOneOn() {
  digitalWrite(7,HIGH);
}

void relayOneOff() {
  digitalWrite(7,LOW);
}

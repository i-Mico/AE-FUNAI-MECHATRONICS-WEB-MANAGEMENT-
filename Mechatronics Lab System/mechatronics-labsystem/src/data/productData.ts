import raspberryPiImage from '../assets/images/Raspberry Pi 4 Model B (4GB).png';
import breadboardImage from '../assets/images/Breadboard + Jumper Wire Set.jpg';
import esp32Image from '../assets/images/ESP32 Development Board.jpg';
import l298nImage from '../assets/images/L298N Motor Driver Module.jpg';
import ultrasonicImage from '../assets/images/Ultrasonic Sensor HC-SR04.jpg';
import multimeterImage from '../assets/images/Review of UNI-T UT61E.jpg';


export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  stock: number;
  badge: 'Best Seller' | 'Hot' | 'New' | 'Popular' | null;
  image: string;
  description: string;
  specs?: Record<string, string>;
}

export const products: Product[] = [
  {
    id: 'rpi4', name: 'Raspberry Pi 4 Model B (4GB)', category: 'Microcontroller', price: 88000,
    rating: 4.9, reviews: 89, stock: 45, badge: 'Best Seller', image: raspberryPiImage,
    description: 'Raspberry Pi 4 with 4GB RAM, dual 4K display support, USB 3.0, Gigabit Ethernet.',
    specs: { RAM: '4GB LPDDR4X', Processor: 'Broadcom BCM2711 Quad-core', 'Clock Speed': '1.8 GHz', 'USB Ports': '2x USB 3.0, 2x USB 2.0', 'Display Output': '2x micro-HDMI (4K)', Networking: 'Gigabit Ethernet, WiFi 5, BT 5.0', Power: '5V DC via USB-C' }
  },
  {
    id: 'arduino_mega', name: 'Arduino Mega 2560 Rev3', category: 'Microcontroller', price: 46000,
    rating: 4.8, reviews: 124, stock: 30, badge: 'Popular', image: breadboardImage,
    description: 'Official Arduino Mega 2560 Rev3 with 54 digital I/O pins, 16 analog inputs, USB connection.'
  },
  {
    id: 'dmm_pro', name: 'Digital Multimeter (Pro)', category: 'Measurement', price: 55000,
    rating: 4.7, reviews: 67, stock: 12, badge: null, image: multimeterImage,
    description: 'Auto-ranging digital multimeter, RMS, temperature probe, and display.'
  },
  {
    id: 'breadboard_set', name: 'Breadboard + Jumper Wire Set', category: 'Electronics', price: 19000,
    rating: 4.5, reviews: 312, stock: 80, badge: null, image: '🔌',
    description: '830-point solderless breadboard with 120-piece jumper wire set in multiple lengths.'
  },
  {
    id: 'hc_sr04', name: 'Ultrasonic Sensor HC-SR04', category: 'Sensors', price: 8000,
    rating: 4.6, reviews: 445, stock: 200, badge: null, image: ultrasonicImage,
    description: 'Ultrasonic ranging module, 2cm–400cm range, 3mm accuracy, 5V operation.'
  },
  {
    id: 'l298n', name: 'L298N Motor Driver Module', category: 'Actuators', price: 12000,
    rating: 4.7, reviews: 178, stock: 95, badge: null, image: l298nImage,
    description: 'Dual H-bridge motor driver, two motors or one stepper, 5V–35V, 2 channel.'
  },
  {
    id: 'esp32', name: 'ESP32 Development Board', category: 'Microcontroller', price: 16000,
    rating: 4.8, reviews: 267, stock: 70, badge: 'Hot', image: esp32Image,
    description: 'ESP32 with built-in WiFi & Bluetooth, 38 GPIO pins, dual-core 240MHz processor.'
  },
  {
    id: 'pir_sensor', name: 'PIR Motion Sensor', category: 'Sensors', price: 5500,
    rating: 4.4, reviews: 189, stock: 150, badge: null, image: '👁️',
    description: 'Passive infrared motion sensor, adjustable sensitivity and delay, 3.3V–5V.'
  },
  {
    id: 'lcd_16x2', name: '16x2 LCD Display Module', category: 'Displays', price: 11000,
    rating: 4.5, reviews: 134, stock: 55, badge: null, image: '🖥️',
    description: '16x2 character LCD with I2C interface, blue backlight, 5V, compatible with Arduino.'
  },
  {
    id: 'stepper_nema', name: 'Stepper Motor + Driver', category: 'Actuators', price: 25000,
    rating: 4.9, reviews: 98, stock: 40, badge: 'Popular', image: '🔧',
    description: 'NEMA 17 stepper motor with A4988 driver, 1.7A, 200 steps/rev.'
  },
  {
    id: 'logic_analyzer', name: 'USB Logic Analyzer', category: 'Measurement', price: 32000,
    rating: 4.6, reviews: 42, stock: 18, badge: 'New', image: '📊',
    description: '24MHz 8-channel logic analyzer for debugging digital signals.'
  },
  {
    id: 'soldering_iron', name: 'Soldering Station', category: 'Tools', price: 45000,
    rating: 4.8, reviews: 76, stock: 25, badge: null, image: '🔥',
    description: 'Temperature-controlled soldering station, 50W, 200-480°C range.'
  },
];
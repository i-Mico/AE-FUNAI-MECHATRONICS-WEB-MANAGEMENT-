import raspberryPiImage from '../assets/images/Raspberry Pi 4 Model B (4GB).png';
import arduinoImage from '../assets/images/Breadboard + Jumper Wire Set.jpg';
import multimeterImage from '../assets/images/Review of UNI-T UT61E.jpg';
import roboticArmImage from '../assets/images/Teo.png';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  location: string;
  tag:
    | "Measurement"
    | "Fabrication"
    | "Microcontroller"
    | "Robotics"
    | "Electronics";
  status: "available" | "unavailable" | "maintenance";
  imagePlaceholder: string;
  image?: string;
}

export const equipmentList: Equipment[] = [
  {
    id: "osc1",
    name: "Oscilloscope",
    description:
      "4-channel 200MHz digital oscilloscope for signal analysis and debugging.",
    location: "Lab A",
    tag: "Measurement",
    status: "available",
    imagePlaceholder: "📊",
  },
  {
    id: "3dp1",
    name: "3D Printer",
    description:
      "FDM 3D printer with 300x300x400mm build volume, supports PLA/ABS/PETG.",
    location: "Lab B",
    tag: "Fabrication",
    status: "unavailable",
    imagePlaceholder: "🖨️",
  },
  {
    id: "ard1",
    name: "Arduino Kit",
    description:
      "Complete Arduino Mega starter kit with sensors, actuators, and breadboard.",
    location: "Lab C",
    tag: "Microcontroller",
    status: "available",
    imagePlaceholder: "⚡",
    image: arduinoImage,
  },
  {
    id: "cnc1",
    name: "CNC Machine",
    description:
      "3-axis CNC milling machine for precision metal and plastic parts.",
    location: "Lab A",
    tag: "Fabrication",
    status: "maintenance",
    imagePlaceholder: "⚙️",
  },
  {
    id: "rob1",
    name: "Robotic Arm",
    description:
      "6-DOF robotic arm with teach pendant, payload 5kg, reach 800mm.",
    location: "Lab B",
    tag: "Robotics",
    status: "available",
    imagePlaceholder: "🤖",
    image: roboticArmImage,
  },
  {
    id: "laser1",
    name: "Laser Cutter",
    description: "60W CO2 laser cutter for acrylic, wood, and fabric.",
    location: "Lab C",
    tag: "Fabrication",
    status: "available",
    imagePlaceholder: "🔦",
  },
  {
    id: "multi1",
    name: "Multimeter Set",
    description:
      "Set of 10 digital multimeters for voltage, current, and resistance measurement.",
    location: "Lab A",
    tag: "Measurement",
    status: "available",
    imagePlaceholder: "📟",
    image: multimeterImage,
  },
  {
    id: "solder1",
    name: "Soldering Station",
    description:
      "Temperature-controlled soldering station, 50W, 200-480°C range.",
    location: "Lab B",
    tag: "Electronics",
    status: "available",
    imagePlaceholder: "🔥",
  },
  {
    id: "rpi1",
    name: "Raspberry Pi Kit",
    description:
      "Raspberry Pi 4 kit with camera, sensors, and GPIO breakout board.",
    location: "Lab C",
    tag: "Microcontroller",
    status: "unavailable",
    imagePlaceholder: "🍓",
    image: raspberryPiImage,
  },
  {
    id: "powersup1",
    name: "Power Supply",
    description: "Adjustable DC power supply 0-30V, 0-5A with digital display.",
    location: "Lab A",
    tag: "Electronics",
    status: "available",
    imagePlaceholder: "🔌",
  },
];

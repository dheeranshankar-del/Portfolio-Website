import { assetPath } from '../utils/assetPath';

export const personalInfo = {
  name: "Dheeran",
  fullName: "Dheeran Shankar",
  title: "Electrical Engineering Student @ York University",
  heroSubtitle: "Building embedded systems, high-speed PCB layouts, rocket telemetry, and intelligent hardware for extreme operating environments.",
  specialties: [
    'Embedded Systems',
    'Hardware Development',
    'PCB Design',
    'Machine Learning',
    'Computer Vision',
    'Robotics',
    'Avionics',
    'Aerospace',
    'FPGA Development',
    'ASIC Development',
    'System Integration',
    'System Controls',
    'Automation'
  ],
  location: "Toronto, ON • York University",
  email: "dheeranshankar@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/dheeran-shankar-303b48275/",
    github: "https://github.com/dheeranshankar-del",
    resume: assetPath("/resume.pdf")
  },
  about: {
    story: "I am a 3rd-year Electrical Engineering student at York University passionate about embedded systems, avionics hardware, PCB design, and autonomous robotics. Through hands-on experience with Arbalest Rocketry and personal engineering builds, I bridge low-level bare-metal C/C++ firmware with robust hardware architectures.",
    interests: [
      { name: "Embedded Systems", desc: "Bare-metal MCU firmware, FreeRTOS, STM32, and ESP32 integration." },
      { name: "PCB Design", desc: "Multi-layer PCB layout, signal integrity, power distribution, and KiCad design." },
      { name: "Aerospace Avionics", desc: "Rocket telemetry ground stations, sensor DAQ, and high-reliability hardware." },
      { name: "Robotics & AI", desc: "Sensor fusion, motor control, ultrasonic navigation, and OpenCV ADAS vision." }
    ],
    activities: [
      {
        org: "Arbalest Rocketry Club",
        role: "Avionics & Telemetry Engineer",
        desc: "Engineered real-time UDP telemetry streaming and ground station data visualization for rocket launches.",
        badge: "Rocketry Team"
      },
      {
        org: "York University Engineering",
        role: "Electrical Engineering B.A.Sc. Candidate",
        desc: "Focusing on circuit theory, digital logic, microcontrollers, embedded firmware, and control systems.",
        badge: "Academic"
      }
    ],
    skills: {
      languages: ["C/C++", "Python", "Verilog / VHDL", "MATLAB", "SQL"],
      hardware: ["STM32", "ESP32", "Arduino", "FPGA", "Mecanum Drives", "IMU / DAQ"],
      tools: ["KiCad", "STM32CubeIDE", "PlatformIO", "PyQt6", "Git / GitHub"],
      software: ["OpenCV", "NumPy", "FreeRTOS", "Linux / Bash", "Vite / React"]
    }
  }
};

export const projectsData = [
  {
    id: "arbalest-telemetry",
    number: "01",
    title: "Real-Time Rocket Telemetry Ground Station",
    org: "Arbalest Rocketry Club",
    category: "DAQ & Telemetry",
    shortDesc: "A real-time telemetry system that streams IMU data over UDP and visualizes rocket orientation, acceleration, and system health through a custom-built Python ground station.",
    caption: "Live hardware demonstration — rotating the IMU updates the rocket orientation in real time.",
    tech: ["Python", "PyQt6", "UDP", "MacBook UDP Bridge", "IMU"],
    hardwareVideo: assetPath("/projects/hardware-demo.mov"),
    softwareVideo: assetPath("/projects/ground-station-demo.mp4"),
    poster: assetPath("/projects/rocket-ground-station.png"),
    hasMissionControl: true,
    layout: "standard"
  },
  {
    id: "stm32-dev-board",
    number: "02",
    title: "STM32 Development Board",
    org: "Personal Engineering Project",
    category: "Embedded Hardware • PCB Design",
    shortDesc: "Designed a custom 2-layer STM32F103 development board for embedded firmware prototyping. The board integrates USB connectivity, SWD debugging, GPIO expansion, a regulated 3.3V power subsystem, and follows STM32 hardware design guidelines for signal integrity and reliable operation.",
    tech: ["STM32F103", "KiCad", "STM32CubeIDE", "USB", "SWD", "PCB Design"],
    image: assetPath("/projects/stm32-actual-pcb.png"),
    hasMissionControl: false,
    layout: "alternate",
    writeup: {
      overview: "Designed a compact 2-layer development board around the STM32F103 (ARM Cortex-M3) microcontroller in KiCad. Engineered for rapid bare-metal firmware prototyping, sensor interfacing, and hardware validation.",
      architecture: [
        "MCU & Subsystem (U1): STM32F103 (LQFP-48) with 8MHz HSE crystal oscillator (Y1) and 32.768kHz LSE RTC timing circuit.",
        "Power Subsystem (U2 & FB1): High-efficiency 3.3V LDO regulator (U2) stepping down 5V USB VBUS with ferrite bead (FB1) high-frequency noise decoupling.",
        "Headers & Peripherals (J1-J4, SW1, D1): USB Type-C interface (J1), SWD debug header pins (J4), GPIO expansion headers (J2, J3), tactile reset switch (SW1), and power/status LED (D1)."
      ]
    }
  },
  {
    id: "autonomous-rover",
    number: "03",
    title: "Autonomous Rover with Sensor Fusion",
    org: "Personal Engineering Project",
    category: "Robotics • Embedded Firmware • Sensor Fusion",
    shortDesc: "Designed and built an ESP32/Arduino-based autonomous rover with mecanum wheels, ultrasonic sensing, dual motor control, and battery-powered embedded navigation. The rover uses real-time sensor input for obstacle detection and low-level motor control.",
    tech: ["ESP32-C3", "Arduino", "C/C++", "PlatformIO", "Ultrasonic Sensor", "Motor Drivers", "Mecanum Wheels", "Sensor Fusion"],
    image: assetPath("/projects/rover.jpg"),
    hasMissionControl: false,
    layout: "rover-card"
  },
  {
    id: "lane-assist-adas",
    number: "04",
    title: "Computer Vision-Based Lane Assist for ADAS",
    org: "Personal Engineering Project",
    category: "Computer Vision • ADAS • Autonomous Systems",
    shortDesc: "Developed a prototype ADAS lane detection system using OpenCV, Canny edge detection, region-of-interest masking, and Hough Transform line detection. The system processes driving footage in real time, visualizes detected lane boundaries, estimates lane offset, and displays confidence feedback.",
    tech: ["Python", "OpenCV", "NumPy", "Canny Edge Detection", "Hough Transform", "ADAS", "Computer Vision"],
    images: {
      mask: assetPath("/projects/lane-mask.png"),
      result: assetPath("/projects/lane-result.png"),
      assist: assetPath("/projects/lane-assist.png")
    },
    hasMissionControl: false,
    layout: "montage-card"
  }
];

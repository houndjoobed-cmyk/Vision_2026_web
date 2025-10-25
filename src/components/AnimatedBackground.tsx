import { motion } from 'motion/react';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-black via-[#1a0a0a] to-black">
      {/* Animated Stars/Vision Points */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#ffcf00] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Vision Light Rays */}
      <div className="absolute top-0 right-1/4 w-96 h-96 opacity-20">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-[#ffcf00] via-[#fe0000]/50 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Mountain/Path Silhouette */}
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b5882a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Mountain layers */}
        <motion.path
          d="M0,800 L0,500 Q200,400 400,450 T800,400 L1200,350 L1200,800 Z"
          fill="url(#mountainGradient)"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 1.5 }}
        />
        
        <motion.path
          d="M0,800 L0,600 Q300,500 600,550 T1200,500 L1200,800 Z"
          fill="rgba(181, 136, 42, 0.2)"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2 }}
        />
      </svg>

      {/* Floating Path Steps */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`step-${i}`}
          className="absolute rounded-lg shadow-lg"
          style={{
            left: `${25 + i * 8}%`,
            bottom: `${30 + i * 6}%`,
            width: '80px',
            height: '12px',
            background: `linear-gradient(135deg, #b5882a ${i * 10}%, #ffcf00 100%)`,
            boxShadow: '0 4px 15px rgba(181, 136, 42, 0.4)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 1 + i * 0.1,
          }}
        />
      ))}

      {/* Beautiful Stylized Person Climbing */}
      <motion.div
        className="absolute"
        style={{
          left: '52%',
            bottom: '66%',
          transform: 'translateX(-50%)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      >
        <motion.svg
          width="100"
          height="140"
          viewBox="0 0 100 140"
          xmlns="http://www.w3.org/2000/svg"
          animate={{
            y: [-3, 3, -3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <defs>
            {/* Gradient for clothing */}
            <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fe0000" />
              <stop offset="100%" stopColor="#b5882a" />
            </linearGradient>
            
            {/* Gradient for pants */}
            <linearGradient id="pantsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse
            cx="50"
            cy="135"
            rx="20"
            ry="3"
            fill="#000000"
            opacity="0.3"
          />

          {/* Back Arm */}
          <motion.path
            d="M50,48 Q35,52 30,62"
            stroke="#d4a574"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: [
                "M50,48 Q35,52 30,62",
                "M50,48 Q33,50 28,60",
                "M50,48 Q35,52 30,62",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Back Leg */}
          <motion.path
            d="M50,80 L42,115"
            stroke="url(#pantsGradient)"
            strokeWidth="7"
            strokeLinecap="round"
            animate={{
              d: [
                "M50,80 L42,115",
                "M50,80 L40,118",
                "M50,80 L42,115",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          
          {/* Shoes - Back foot */}
          <ellipse
            cx="42"
            cy="117"
            rx="6"
            ry="4"
            fill="#ffcf00"
          />

          {/* Body/Torso */}
          <motion.ellipse
            cx="50"
            cy="60"
            rx="14"
            ry="22"
            fill="url(#shirtGradient)"
            animate={{
              ry: [22, 23, 22],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Front Leg */}
          <motion.path
            d="M50,80 L58,115"
            stroke="url(#pantsGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            animate={{
              d: [
                "M50,80 L58,115",
                "M50,80 L60,118",
                "M50,80 L58,115",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.3,
            }}
          />

          {/* Shoes - Front foot */}
          <ellipse
            cx="58"
            cy="117"
            rx="7"
            ry="4"
            fill="#ffcf00"
          />

          {/* Neck */}
          <rect
            x="47"
            y="38"
            width="6"
            height="8"
            fill="#d4a574"
            rx="2"
          />

          {/* Head */}
          <circle
            cx="50"
            cy="30"
            r="12"
            fill="#d4a574"
          />
          
          {/* Hair - Modern style */}
           <path
           d="M38,28 Q38,18 41,15 Q45,18 48,15 Q50,18 53,15 Q57,18 60,15 Q62,18 62,28 Q62,22 58,20 Q54,18 50,20 Q46,18 42,20 Q38,22 38,28"
           fill="url(#hairGradient)"
           />

            <defs>
                <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B1700" />
                    <stop offset="100%" stopColor="#6B4226" />
                </linearGradient>
            </defs>



           
          {/* Hair details/strands */}
          <motion.path
            d="M45,19 Q47,16 49,19"
            stroke="#000"
            strokeWidth="1.5"
            fill="none"
            animate={{
              d: [
                "M45,19 Q47,16 49,19",
                "M45,19 Q47,15 49,19",
                "M45,19 Q47,16 49,19",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />

          {/* Ear */}
          <ellipse
            cx="38"
            cy="30"
            rx="2"
            ry="3"
            fill="#c99966"
          />

          {/* Eye */}
          <circle cx="54" cy="30" r="1.5" fill="#1a1a1a" />
          <circle cx="45" cy="30" r="1.5" fill="#1a1a1a" />
          
          {/* Eyebrow */}
          {/* right */}
          <path
            d="M42,26 Q45,24 48,26"
            stroke="#1a1a1a"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
           {/* left */}
          <path
            d="M51,26 Q54,24 57,26"
            stroke="#1a1a1a"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Smile - Determined expression */}
          <motion.path
            d="M44,34 Q50,38 56,34"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: [
                "M48,34 Q50,38 54,34",
                "M48,34 Q50,36 54,34",
                "M48,34 Q50,38 54,34",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />

          {/* Front Arm - Reaching forward */}
          <motion.path
            d="M50,48 Q65,48 72,42"
            stroke="#d4a574"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: [
                "M50,48 Q65,48 72,42",
                "M50,48 Q68,46 75,40",
                "M50,48 Q65,48 72,42",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.2,
            }}
          />

          {/* Hand - Front */}
          <motion.circle
            cx="72"
            cy="42"
            r="4"
            fill="#d4a574"
            animate={{
              cx: [72, 75, 72],
              cy: [42, 40, 42],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.2,
            }}
          />

          {/* Hand - Back */}
          <circle
            cx="30"
            cy="62"
            r="3.5"
            fill="#d4a574"
          />

          {/* Backpack straps */}
          <path
            d="M44,45 L44,70"
            stroke="#b5882a"
            strokeWidth="2"
          />
          <path
            d="M56,45 L56,70"
            stroke="#b5882a"
            strokeWidth="2"
          />

          {/* Energy/Determination aura */}
          <motion.circle
            cx="50"
            cy="30"
            r="18"
            fill="none"
            stroke="#ffcf00"
            strokeWidth="1"
            opacity="0.3"
            animate={{
              r: [18, 22, 18],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.svg>
      </motion.div>

      {/* Small "2026" Goal - After last step */}
      <motion.div
        className="absolute"
        style={{
          left: '88%',
          bottom: '80%',
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
      >
        <motion.div
          className="relative"
          animate={{
            y: [-5, 5, -5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 blur-xl"
            style={{
              background: 'radial-gradient(circle, rgba(255, 207, 0, 0.6) 0%, transparent 70%)',
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          
          {/* 2026 Text */}
          <div className="relative">
            <motion.svg width="40" height="50" viewBox="0 0 70 40">
              <defs>
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffcf00" />
                  <stop offset="50%" stopColor="#fe0000" />
                  <stop offset="100%" stopColor="#b5882a" />
                </linearGradient>
              </defs>
              <text
                x="30"
                y="40"
                fontSize="27"
                fontWeight="bold"
                fill="url(#textGradient)"
                textAnchor="middle"
                style={{ textShadow: '0 0 10px rgba(255, 207, 0, 0.8)' }}
              >
                2026
              </text>
            </motion.svg>
            
            {/* Star decoration */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity },
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M8,2 L9,6 L13,7 L9,9 L10,13 L8,11 L6,13 L7,9 L3,7 L7,6 Z"
                  fill="#ffcf00"
                  stroke="#fe0000"
                  strokeWidth="1"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Inspirational Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-[#ffcf00] rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: `${20 + Math.random() * 40}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

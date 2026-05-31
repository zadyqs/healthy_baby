import {Audio} from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const message =
  "这次肯定行！老婆——你现在肚肚里的绝对是一个健康的胚胎，之后的每一次检查都特别顺利，一次次的证明着这一点，然后经过一个完美的十月怀胎，最终在明年，我们拥有了一个独属于我们的健康宝宝！";

type FireworkBurstProps = {
  colorA: string;
  colorB: string;
  frame: number;
  size: number;
  startFrame: number;
  x: number;
  y: number;
};

const sparks = Array.from({length: 18}, (_, index) => index);
const fireworks = [
  {colorA: "#ff18d8", colorB: "#ffe600", delay: 0, size: 300, x: 330, y: 220},
  {colorA: "#00eaff", colorB: "#22ff55", delay: 7, size: 260, x: 1510, y: 230},
  {colorA: "#ffe600", colorB: "#ff8a00", delay: 15, size: 320, x: 980, y: 160},
  {colorA: "#22ff55", colorB: "#ff18d8", delay: 25, size: 270, x: 1650, y: 610},
  {colorA: "#ff8a00", colorB: "#00eaff", delay: 38, size: 290, x: 420, y: 710},
  {colorA: "#ffe600", colorB: "#ff18d8", delay: 50, size: 250, x: 1190, y: 760},
  {colorA: "#22ff55", colorB: "#ffe600", delay: 65, size: 280, x: 760, y: 330},
  {colorA: "#00eaff", colorB: "#ff18d8", delay: 82, size: 300, x: 1450, y: 830},
] as const;

const FireworkBurst = ({
  colorA,
  colorB,
  frame,
  size,
  startFrame,
  x,
  y,
}: FireworkBurstProps) => {
  const localFrame = frame - startFrame;
  const burstDuration = 28;

  if (localFrame < 0 || localFrame > burstDuration) {
    return null;
  }

  const progress = localFrame / burstDuration;
  const opacity = interpolate(progress, [0, 0.16, 0.72, 1], [0, 0.88, 0.58, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radius = interpolate(progress, [0, 1], [size * 0.14, size], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tailLength = interpolate(progress, [0, 1], [size * 0.08, size * 0.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} fill={colorB} opacity="0.58" r={size * 0.13} />
      {sparks.map((spark) => {
        const angle = (spark / sparks.length) * Math.PI * 2;
        const wobble = spark % 2 === 0 ? 0.82 : 1.08;
        const outer = radius * wobble;
        const inner = Math.max(0, outer - tailLength);
        const x1 = x + Math.cos(angle) * inner;
        const y1 = y + Math.sin(angle) * inner;
        const x2 = x + Math.cos(angle) * outer;
        const y2 = y + Math.sin(angle) * outer;

        return (
          <line
            key={spark}
            stroke={spark % 2 === 0 ? colorA : colorB}
            strokeLinecap="round"
            strokeWidth={9 - progress * 3.5}
            x1={x1}
            x2={x2}
            y1={y1}
            y2={y2}
          />
        );
      })}
    </g>
  );
};

const CelebrationText = ({frame, startFrame}: {frame: number; startFrame: number}) => {
  const localFrame = frame - startFrame;

  if (localFrame < 0) {
    return null;
  }

  const firstProgress = interpolate(localFrame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const secondProgress = interpolate(localFrame, [15, 42], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = 0.72 + Math.sin(localFrame * 0.14) * 0.12;

  return (
    <svg
      height="1080"
      viewBox="0 0 1920 1080"
      width="1920"
      style={{
        filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.24))",
        inset: 0,
        opacity: interpolate(localFrame, [0, 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        position: "absolute",
      }}
    >
      <defs>
        <linearGradient id="celebrationGradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#ff18d8" />
          <stop offset="28%" stopColor="#ffe600" />
          <stop offset="58%" stopColor="#00eaff" />
          <stop offset="100%" stopColor="#22ff55" />
        </linearGradient>
        <path d="M 80 590 Q 430 500 780 590" id="celebrationArcTop" />
        <path d="M 110 750 Q 430 830 750 750" id="celebrationArcBottom" />
      </defs>
      <rect fill="rgba(255,255,255,0.16)" height="1080" width="1920" />
      <text
        fill="url(#celebrationGradient)"
        fontFamily='"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", Arial, sans-serif'
        fontSize="108"
        fontWeight="900"
        opacity={glow}
        paintOrder="stroke fill"
        stroke="rgba(255,255,255,0.96)"
        strokeWidth="12"
        textAnchor="middle"
        transform={`translate(0 ${34 - firstProgress * 34}) scale(${0.86 + firstProgress * 0.14})`}
      >
        <textPath href="#celebrationArcTop" startOffset="50%">
          母子健康
        </textPath>
      </text>
      <text
        fill="url(#celebrationGradient)"
        fontFamily='"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", Arial, sans-serif'
        fontSize="108"
        fontWeight="900"
        opacity={glow}
        paintOrder="stroke fill"
        stroke="rgba(255,255,255,0.96)"
        strokeWidth="12"
        textAnchor="middle"
        transform={`translate(0 ${-34 + secondProgress * 34}) scale(${0.86 + secondProgress * 0.14})`}
      >
        <textPath href="#celebrationArcBottom" startOffset="50%">
          母子平安
        </textPath>
      </text>
    </svg>
  );
};

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const introEnd = 60;
  const typingStart = introEnd;
  const typingDuration = 300;
  const holdAfterTyping = 120;
  const fireworkStart = typingStart + typingDuration + holdAfterTyping;
  const textProgress = Math.min(
    1,
    Math.max(0, (frame - typingStart) / typingDuration),
  );
  const visibleMessage = message.slice(
    0,
    Math.ceil(message.length * textProgress),
  );
  const loopProgress = (frame / introEnd) * Math.PI * 2;
  const orbitX = Math.sin(loopProgress) * 520;
  const orbitY = Math.sin(loopProgress * 2) * 230;
  const parkedX = -530;
  const parkedY = -225;
  const settleProgress = interpolate(frame, [42, introEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const moveX = orbitX * (1 - settleProgress) + parkedX * settleProgress;
  const moveY = orbitY * (1 - settleProgress) + parkedY * settleProgress;
  const jiggleRotate = Math.sin(frame * 0.55) * 3;
  const jiggleX = frame < introEnd ? Math.sin(frame * 0.8) * 8 : 0;
  const jiggleY = frame < introEnd ? Math.cos(frame * 0.7) * 6 : 0;
  const scale = frame < introEnd ? 1 + Math.sin(frame * 0.6) * 0.035 : 0.76;
  const titleOpacity =
    frame < introEnd
      ? 0.9
      : interpolate(frame, [fireworkStart - 8, fireworkStart + 12], [0.7, 0.82], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const messageOpacity =
    frame < typingStart
      ? 0
      : interpolate(frame, [fireworkStart - 20, fireworkStart], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Audio
        loop
        playbackRate={1.5}
        src={staticFile("枕边的祝愿.mp3")}
        volume={0.61}
      />
      <Img
        src={staticFile("healthy-baby-background.png")}
        style={{
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          width: "100%",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.55))",
        }}
      />
      <svg
        height="1080"
        viewBox="0 0 1920 1080"
        width="1920"
        style={{
          filter: "drop-shadow(0 0 14px rgba(255,255,255,0.5))",
          inset: 0,
          opacity: frame >= fireworkStart ? 1 : 0,
          position: "absolute",
        }}
      >
        {fireworks.map((firework) => (
          <FireworkBurst
            key={`${firework.x}-${firework.y}`}
            colorA={firework.colorA}
            colorB={firework.colorB}
            frame={frame}
            size={firework.size}
            startFrame={fireworkStart + firework.delay}
            x={firework.x}
            y={firework.y}
          />
        ))}
      </svg>
      <CelebrationText frame={frame} startFrame={fireworkStart} />
      <svg
        height="190"
        viewBox="0 0 820 190"
        width="820"
        style={{
          filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.28))",
          opacity: titleOpacity,
          overflow: "visible",
          position: "relative",
          transform: `translate(${moveX + jiggleX}px, ${moveY + jiggleY}px) rotate(${frame < introEnd ? jiggleRotate : -7}deg) scale(${scale})`,
        }}
      >
        <defs>
          <linearGradient id="healthyBabyGradient" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#ff18d8" />
            <stop offset="28%" stopColor="#ffe600" />
            <stop offset="58%" stopColor="#00eaff" />
            <stop offset="100%" stopColor="#22ff55" />
          </linearGradient>
        </defs>
        <text
          fill="url(#healthyBabyGradient)"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="124"
          fontWeight="900"
          letterSpacing="0"
          paintOrder="stroke fill"
          stroke="rgba(255,255,255,0.92)"
          strokeWidth="12"
          textAnchor="middle"
          x="410"
          y="124"
        >
          healthy baby
        </text>
      </svg>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.42)",
          borderRadius: 18,
          color: "#ff18d8",
          fontFamily:
            '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", Arial, sans-serif',
          fontSize: 39,
          fontWeight: 800,
          left: 118,
          letterSpacing: 0,
          lineHeight: 1.42,
          opacity: messageOpacity,
          padding: "20px 26px",
          position: "absolute",
          textShadow:
            "0 2px 0 rgba(255,255,255,0.95), 0 8px 22px rgba(0,0,0,0.2)",
          top: 460,
          width: 720,
        }}
      >
        <span
          style={{
            background:
              "linear-gradient(90deg, #ff18d8 0%, #ff8a00 24%, #ffe600 48%, #00d9ff 72%, #22ff55 100%)",
            backgroundClip: "text",
            color: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {visibleMessage}
        </span>
      </div>
    </AbsoluteFill>
  );
};

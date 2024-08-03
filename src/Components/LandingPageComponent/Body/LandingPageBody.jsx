import React, { useEffect, useRef, useState } from "react";
import VisibilitySensor from "react-visibility-sensor";
import { motion } from "framer-motion";
import Typed from "typed.js";
import "./LandingPageBody.css"; // Import the custom CSS file

import Image1 from "../../../assets/images/phone_view_1.png";
import Image2 from "../../../assets/images/phone_view_2.png";
import Image3 from "../../../assets/images/phone_view_3.png";
import Image4 from "../../../assets/images/phone_view_4.png";
import SongWave from "../../../assets/images/SongWave2.png";
import AudioWave from "../../../assets/images/AudioWave.png";

function LandingPageBody() {
  const [elementIsVisible, setElementIsVisible] = useState(false);

  const typedElement = useRef(null);

  useEffect(() => {
    const options = {
      strings: ["Any Time", "Any Where", "Any Place"],
      typeSpeed: 50,
      backSpeed: 50,
      smartBackspace: true, // this is a default
      loop: true,
    };

    const typed = new Typed(typedElement.current, options);

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  const bg = {
    true: {
      left: "7rem",
    },
    false: {
      left: "19rem",
    },
  };
  const musicPlayer = {
    true: {
      left: "295px",
    },
    false: {
      left: "235px",
    },
  };
  const rect = {
    true: {
      left: "11rem",
    },
    false: {
      left: "13rem",
    },
  };
  const heart = {
    true: {
      left: "9rem",
    },
    false: {
      left: "12.5rem",
    },
  };
  return (
    <VisibilitySensor
      onChange={(isVisible) => setElementIsVisible(isVisible)}
      minTopValue={200}
    >
      <div className="body wrapper bg-dark d-flex align-items-center justify-content-between px-5 rounded-bottom w-100 h-350 position-relative z-3">
        {/* left side */}
        <div className="text-white d-flex flex-column align-items-start justify-content-center h-100 h1 display-6">
          <span className="fw-bold app-name-rainbow">VIBE VAULT</span>
          <span>
            <b>Experience The</b>
          </span>
          <span className="mb-3 fw-bold">Best Quality Music</span>
          <span className="text-white fw-normal" style={{ fontSize: "20px" }}>
            Unleash the Power of Music,{" "}
            <span style={{ color: "#ffa500" }} ref={typedElement}></span>
            <br />
            Your Soundtrack Awaits!
          </span>
        </div>
        {/* <img src={AudioWave} alt="" style={{ width: "30%" }} /> */}
        <div className="images position-relative w-50">
          <img
            src={SongWave}
            alt=""
            className="position-absolute top-negative-80px left-190px w-50"
          />

          <img
            src={Image1}
            alt=""
            className="position-absolute top-negative-150px h-340px left-130px"
          />
          <motion.img
            variants={musicPlayer}
            animate={`${elementIsVisible}`}
            transition={{
              duration: 1,
              type: "ease-out",
            }}
            src={Image2}
            alt=""
            className="position-absolute left-235px top-94px w-175px"
          />
          <motion.img
            variants={rect}
            animate={`${elementIsVisible}`}
            transition={{
              type: "ease-out",
              duration: 1,
            }}
            src={Image3}
            alt=""
            className="position-absolute w-50px left-130px top-120px"
          />
          <motion.img
            variants={heart}
            animate={`${elementIsVisible}`}
            transition={{
              type: "ease-out",
              duration: 1,
            }}
            src={Image4}
            alt=""
            className="position-absolute w-50px left-125px top-120px"
          />
        </div>
      </div>
    </VisibilitySensor>
  );
}

export default LandingPageBody;

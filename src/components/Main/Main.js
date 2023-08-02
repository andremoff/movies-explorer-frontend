import React, { useRef } from 'react';
import Promo from '../Promo/Promo';
import AboutProject from '../AboutProject/AboutProject';
import Techs from '../Techs/Techs';
import AboutMe from '../AboutMe/AboutMe';
import Portfolio from '../Portfolio/Portfolio';

const Main = () => {
  const aboutProjectRef = useRef(null);
  const techRef = useRef(null);
  const aboutMeRef = useRef(null);

  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)

  return (
    <>
      <Promo aboutProjectRef={aboutProjectRef} techRef={techRef} aboutMeRef={aboutMeRef} scrollToRef={scrollToRef} />
      <div ref={aboutProjectRef}><AboutProject /></div>
      <div ref={techRef}><Techs /></div>
      <div ref={aboutMeRef}><AboutMe /></div>
      <Portfolio />
    </>
  );
}

export default Main;


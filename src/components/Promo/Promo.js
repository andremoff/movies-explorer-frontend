import './Promo.css';

const Promo = ({ aboutProjectRef, techRef, aboutMeRef, scrollToRef }) => {
  return (
    <section className="promo">
      <div className="promo__container_text">
        <h1 className="promo__title">Учебный проект студента факультета Веб-разработки.</h1>
      </div>
      <div className="promo__container_links">
        <button className="promo__link" onClick={() => scrollToRef(aboutProjectRef)}>О проекте</button>
        <button className="promo__link" onClick={() => scrollToRef(techRef)}>Технологии</button>
        <button className="promo__link" onClick={() => scrollToRef(aboutMeRef)}>Студент</button>
      </div>
    </section>
  )
}

export default Promo;

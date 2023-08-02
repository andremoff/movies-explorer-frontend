import './AboutProject.css';

const AboutProject = () => {
  return (
    <section className="about-project">
      <h2 className="about-project__title">О проекте</h2>
      <div className="about-project__content">
        <div className="about-project__stages">
          <h3 className="about-project__stage-title">Дипломный проект включал 5 этапов</h3>
          <p className="about-project__stage-description">
            Составление плана, работу над бэкендом, вёрстку, добавление функциональности и финальные доработки.
          </p>
        </div>
        <div className="about-project__stages">
          <h3 className="about-project__stage-title">На выполнение диплома ушло 5 недель</h3>
          <p className="about-project__stage-description">
            У каждого этапа был мягкий и жёсткий дедлайн, которые нужно было соблюдать, чтобы успешно защититься.
          </p>
        </div>
      </div>
      <div className="about-project__timebar">
        <div className="about-project__timebar-backend">
          <div className="about-project__timebar-backend-text">1 неделя</div>
          <p className="about-project__timebar-title">Back-end</p>
        </div>
        <div className="about-project__timebar-frontend">
          <div className="about-project__timebar-frontend-text">4 недели</div>
          <p className="about-project__timebar-title">Front-end</p>
        </div>
      </div>
    </section>
  );
};

export default AboutProject;
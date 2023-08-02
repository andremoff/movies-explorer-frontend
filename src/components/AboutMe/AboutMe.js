import './AboutMe.css';
import foto from '../../images/aboutme-demo-foto.png';

const AboutMe = () => {
  return (
    <section className="aboutme">
      <h2 className="aboutme__title">Студент</h2>
      <div className="aboutme__profile">
        <img className="aboutme__profile-photo"
          src={foto} alt="фото профиля"></img>
        <article className="aboutme__profile-text">
          <h2 className="aboutme__profile-text-name">Виталий</h2>
          <h3 className="aboutme__profile-text-group">Фронтенд-разработчик, 30 лет</h3>
          <p className="aboutme__profile-text-description">Я родился и живу в Саратове, закончил факультет экономики СГУ.
            У меня есть жена и дочь. Я люблю слушать музыку, а ещё увлекаюсь бегом. Недавно начал кодить.
            С 2015 года работал в компании «СКБ Контур». После того, как прошёл курс по веб-разработке,
            начал заниматься фриланс-заказами и ушёл с постоянной работы.</p>
          <a className="aboutme__profile-text-link" href="https://github.com/andremoff" target="_blank"
            rel="noopener noreferrer">Github</a>
        </article>
      </div>
    </section>
  );
};

export default AboutMe;

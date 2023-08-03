import './Techs.css';

const Techs = () => {
  return (
    <section className="techs">
      <h2 className="techs__title">Технологии</h2>
      <div className="techs__about">
        <h3 className="techs__about_title">7 технологий</h3>
        <p className="techs__about_discription">На курсе веб-разработки мы освоили технологии,
          которые применили в дипломном проекте.</p>
        <ul className="techs__list">
          <li className="techs__list_item">HTML</li>
          <li className="techs__list_item">CSS</li>
          <li className="techs__list_item">JS</li>
          <li className="techs__list_item">React</li>
          <li className="techs__list_item">Git</li>
          <li className="techs__list_item">Express.js</li>
          <li className="techs__list_item">mongoDB</li>
        </ul>
      </div>
    </section>
  );
};

export default Techs;
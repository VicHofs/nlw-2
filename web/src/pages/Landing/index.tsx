import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';
import landingImg from '../../assets/images/landing.svg';
import studyIcon from '../../assets/images/icons/study.svg';
import teachIcon from '../../assets/images/icons/give-classes.svg';
import purpleHeartIcon from '../../assets/images/icons/purple-heart.svg';

import './styles.css'
import api from '../../services/api';

const Landing = () => {

    const [totalConnections, setTotalConnections] = useState(' ');

    useEffect(() => {
        api.get('connections').then((response) => {
            setTotalConnections(response.data.total)
        })
    })

	return (
		<div id="landing-page">
			<div id="landing-page-content" className="container">
				<div className="logo-container">
					<img src={logoImg} alt="logo" />
					<h2>Sua plataforma de estudos online.</h2>
				</div>
				<img src={landingImg} alt="landing" className="hero-image" />

                <div className="button-container">
                    <Link to="/study" className="study">
                        <img src={studyIcon} alt="Estudar"/>
                        Estudar
                    </Link>

                    <Link to="/teach" className="teach">
                        <img src={teachIcon} alt="Ensinar"/>
                        Ensinar
                    </Link>
                </div>

                <span className="total-connections">
                    Total de {totalConnections} conexões já realizadas <img src={purpleHeartIcon} alt="Coração roxo"/>
                </span>
			</div>
		</div>
	);
};

export default Landing;

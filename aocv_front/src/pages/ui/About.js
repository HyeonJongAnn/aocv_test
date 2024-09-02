import React from 'react'
import '../../scss/ui/About.scss';

const About = () => {
    return (
        <div className='aboutContainer'>
            <img className='mainLogo' src={process.env.PUBLIC_URL + `/assets/icons/animaloh.jpg`} alt='로고' />
            <br/>
<br/>
            <h1 className='aboutTitle'>OUR</h1>
            <h2 className='aboutContent'>우리는 반려동물과의 추억을 만들고 기록합니다.<br/>
                We make memories with pets and promote support</h2>
                <br/>
                <br/>
             <img className='myPetImage' src={process.env.PUBLIC_URL + `/assets/icons/cookie.jpg`} alt='우리집 강아지' />
                <br/>
                <h1 className='aboutTitle2'>Company</h1>
                <h3 className='aboutFooter'>수익금의 일부는 반려동물 후원에 사용되며,
귀하는 애니오 아카이브와 함께 후원에 동참하고 있습니다.
<br/>
<br/>
귀하의 선행은 우리 사회에 큰 감동을 주고,
반려동물의 복지 향상에 중대한 기여를 하고 있습니다.
<br/>
<br/>
귀하의 고귀한 반려동물 후원에 깊은 감사를 드립니다.
<br/>
<br/>
Some of the proceeds go to pet sponsorship,
You are joining the sponsorship with Anioh Archive.
<br/>
<br/>
Your good deeds move our society greatly,
It is making a significant contribution to improving the welfare of pets.
<br/>
<br/>
We deeply appreciate your noble pet sponsorship.</h3>
        </div>
    )
}

export default About;
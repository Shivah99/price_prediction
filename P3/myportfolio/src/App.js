import React from 'react';
import './App.css';

function App() {
    return (
        <div className="App">
            <header>
                <h1>My Portfolio</h1>
                <img src="https://avatars.githubusercontent.com/u/115418400?s=400&u=89de316925522ba4d0029db396afc5baa188614d&v=4" alt="Profile" className="profile-image" style={{ borderRadius: '50%', position: 'absolute', top: '10px', right: '10px' }} />
            </header>
            <nav>
                <a href="#about">About</a>
                <a href="#interests">Interests</a>
                <a href="#contact">Contact</a>
                <a href="#training">Training & Certifications</a>
                <a href="#skills">Technical Skills</a>
            </nav>
            <div className="content">
                <section id="about">
                    <h2>About Me</h2>
                    <p>Dedicated Computer Science and Database Developer with a strong foundation in software development and a growing interest in embedded systems and IoT. Proficient in Java, C, C++, and web development technologies (HTML, CSS, JavaScript, PHP). Experienced in SDLC methodologies and version control using Git. Adept at working independently and collaboratively to create innovative solutions. Passionate about expanding knowledge in emerging technologies and applying skills to cutting-edge projects.</p>
                    <h2>Education & Qualifications</h2>
                    <p>Loyalist College, Toronto, ON (January 2024 - Present)<br/>
                    Ontario College Graduate Certificate in Computer Software and Database Development</p>
                    <p>Guru Nanak Institute of Technical Campus, Hyderabad, India (July 2017 - June 2021)<br/>
                    Bachelor’s degree in Electronics and Communication Engineering<br/>
                    GPA: 7.36</p>
                    <h2>Work Experience</h2>
                    <p>Customer Service Representative | Amazon, India (October 2022 - February 2024)<br/>
                    Provided professional chat support, addressing customer inquiries and resolving issues promptly.<br/>
                    Assisted with order placements, shipment tracking, and returns, ensuring high customer satisfaction.<br/>
                    Maintained service quality in a dynamic retail environment, meeting targets and performance metrics.</p>
                    <h2>Additional Information</h2>
                    <h3>Training & Certifications</h3>
                    <section id="training">
                        <p>Certificate of Internship as Embedded System Developer, 2021: Developed front-end web pages using Bootstrap, Java, JS, PHP, Angular, HTML, CSS, and Ionic.<br/>
                        Internship Project: Developed an app with Ridhan Technologies Pvt Ltd, 2019.<br/>
                        Adobe Creative Suite: Certificate of Completion - Basic training (Jun 2019 - Mar 2020)<br/>
                        Smart Serve Ontario: Issued Jul 2024</p>
                    </section>
                    <h3>Languages</h3>
                    <p>English (Fluent)<br/>
                    Hindi (Proficient)<br/>
                    Telugu (Native)</p>
                    <h3>Technical Skills</h3>
                    <section id="skills">
                        <p>Languages: Java, C, C++, HTML, CSS, JavaScript, PHP<br/>
                        Web Development: Bootstrap, Angular, Ionic<br/>
                        Version Control: Git<br/>
                        Embedded Systems: Microcontrollers, Sensors, Actuators<br/>
                        Database Management: SQL, MySQL</p>
                    </section>
                    <h3>Volunteering</h3>
                    <p>Coordinator at Street Cause (Jun 2019 - Feb 2020)</p>
                </section>
                <section id="interests">
                    <h2>Interests</h2>
                    <p>Seeking job opportunities in software development, database management, embedded systems, and IoT. Passionate about working on innovative technology projects and continuously expanding technical knowledge.</p>
                </section>
                <section id="contact">
                    <h2>Contact</h2>
                    <p>Shivaji Burgula<br/>
                    bshiv****@gmail.com<br/>
                    +1 (647) ***-****</p>
                </section>
            </div>
            <footer>
                <p className="copyright">&copy; 2023 My Portfolio</p>
            </footer>
        </div>
    );
}

export default App;

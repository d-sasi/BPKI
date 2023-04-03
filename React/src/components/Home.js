import RButton from "./r-button";
import "./Home.css"
import styled from "styled-components";
import {useNavigate } from "react-router-dom";

const Home = () => {

  const Buttons = styled.div`
      display: flex;
      justify-content: center;
      height: 25vh;
      margin-top: 10%;
  `;

  const navigate = useNavigate();

  const Handle = (e) => {
    navigate(`/${e}`);
  }

  return (
    <>
      <Buttons>
        <RButton name="Register" handle={Handle}>  </RButton>
        <RButton name="Renew" handle={Handle}>  </RButton>
        <RButton name="Revoke" handle={Handle}> </RButton>
      </Buttons>
      <br/><br/>
      <div className="btn-content">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="100px" width="100px"><rect width="56" height="56" fill="none"/><path d="M80,216H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H80Z" opacity="0.2"/><line x1="112" y1="112" x2="176" y2="112" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="112" y1="144" x2="176" y2="144" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="80" y1="40" x2="80" y2="216" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
        <p>
          <hr/>
            certificate registration is the process of issuing an SSL(Secure
            Socket Layer) certificate for websites to make sure the websites are
            trusted and to detect any imposter computers that may be trying to
            steal data along the way. We provide you the certificate with
            security as our top priority.
          <hr/>
        </p>
      </div>
      <div className="btn-content">
        <svg className= "emoji" xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" fill="currentColor" class="bi bi-shield-shaded" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 14.933a.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067v13.866zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/> </svg>
        <p>
          <hr/>
            SSL certificates aren’t perpetual, meaning you’ll eventually need
            to renew your SSL certificate and do so correctly. Renewing a
            certificate is a relatively simple process. Renewing your
            certificate validates your website’s identity. It ensures the
            encryption you use is up to date, which keeps user data secure
            during transit. 
          <hr/>
        </p>
      </div>
      <div className="btn-content">
        <svg height="100px" viewBox="0 0 21 21" width="100px" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" transform="translate(2 2)"><circle cx="8.5" cy="8.5" r="8"/><path d="m3 3 11 11" transform="matrix(-1 0 0 1 17 0)"/></g></svg>
        <p>
          <hr/>
            Certificate revocation is the act of invalidating a TLS/SSL before
            its scheduled expiration date. A certificate should be revoked
            immediately when its private key shows signs of being compromised.
            It should also be revoked when the domain for which it was issued is
            no longer operational. 
          <hr/>
        </p>
      </div>
      {/* <div className="decor">
        <></>
      </div> */}
    </>
  );
};

export default Home;

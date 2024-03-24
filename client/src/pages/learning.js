// pages/learning.js
import React from 'react';

const Learning = () => {
  return (
    <div>
      <div className="my_container mx-auto mt-10 pb-5">
        <h1 className="bold-title text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-green-400 to-pink-500">learning with CryptocurrencyExchange Simulator</h1>
      </div>
      <div className=" mt-10 pb-20 pl-25 flex justify-center flex-col items-center">
        <div className="text-center">
          <div className="bold-title bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-green-400 to-pink-500 mb-4">Crypto begginers courses</div>
          <div className="video-list">
            <div className="video-item video-container">
              <span class="font-bold text-xl title-style">Crypto Trading for Beginners!</span>
              <iframe title="Crypto Trading for Beginners" width="320" height="180" src="https://www.youtube.com/embed/aJuBQWuHB_I" frameborder="0" allowfullscreen></iframe>
            </div>
            <div className="video-item video-container">
              <span class="font-bold text-xl title-style ">How to Invest in Crypto For Beginners 2024</span>
              <iframe title="How to Invest in Crypto For Beginners 2024" width="320" height="180" src="https://www.youtube.com/embed/S3NOa8MZfDs" frameborder="0" allowfullscreen></iframe>
            </div>
            <div className="video-item video-container">
              <span class="font-bold text-xl title-style ">How To Invest In Crypto Complete Beginner's Guide</span>
              <iframe title="How to Invest in Crypto For Beginners 2024" width="320" height="180" src="https://www.youtube.com/embed/IZWrAbFveSA" frameborder="0" allowfullscreen></iframe>
            </div>
            <div className="video-item video-container">
              <span class="font-bold text-xl title-style ">Cryptocurrency Full Course 2023</span>
              <iframe title="Cryptocurrency Full Course 2023" width="320" height="180" src="https://www.youtube.com/embed/B7wmRucrFoM" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="bold-title bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-green-400 to-pink-500 mb-4">Crypto expert courses</div>
          <div className="video-list">
            <div className="video-item video-container">
            <span class="font-bold text-xl title-style ">How to START Crypto DAY TRADING Expert</span>
              <iframe title="How to START Crypto DAY TRADING (30 Minute Expert)" width="320" height="180" src="https://www.youtube.com/embed/kTzpX3ePAdE" frameborder="0" allowfullscreen></iframe>
            </div>
            <div className="video-item video-container">
              <span class="font-bold text-xl title-style ">Top 3 Best Crypto Day Trading Strategies Experts</span>
              <iframe title="Top 3 Best Crypto Day Trading Strategies" width="320" height="180" src="https://www.youtube.com/embed/fy-tXBaSMOo" frameborder="0" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Learning;

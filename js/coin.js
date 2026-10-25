// Handles 3D coin mechanics, bold minted H/T typography, and 3D layering

import { valueTiers } from './upgrades.js';

// Custom SVG generator for Heads ("H") and Tails ("T")
export function getCoinDesigns() {
    // Slick minted "H" with an engraved/embossed inset look
    const headsSVG = `
        <svg viewBox="0 0 100 100" class="coin-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="inset-shadow-h">
                    <feOffset dx="0" dy="1.5"/>
                    <feGaussianBlur stdDeviation="0.7" result="offset-blur"/>
                    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                    <feFlood flood-color="black" flood-opacity="0.85" result="color"/>
                    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                    <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                </filter>
            </defs>
            <!-- Minted Inner Ring -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="1.5"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
            
            <!-- Bold & Slick "H" Typography -->
            <text x="50" y="68" 
                  font-size="54" 
                  font-family="'Montserrat', sans-serif" 
                  font-weight="900" 
                  text-anchor="middle" 
                  fill="rgba(0,0,0,0.8)" 
                  filter="url(#inset-shadow-h)"
                  letter-spacing="2">H</text>
        </svg>
    `;

    // Slick minted "T" with an engraved/embossed inset look
    const tailsSVG = `
        <svg viewBox="0 0 100 100" class="coin-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="inset-shadow-t">
                    <feOffset dx="0" dy="1.5"/>
                    <feGaussianBlur stdDeviation="0.7" result="offset-blur"/>
                    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                    <feFlood flood-color="black" flood-opacity="0.85" result="color"/>
                    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                    <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                </filter>
            </defs>
            <!-- Minted Inner Ring -->
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.5)" stroke-width="1.5"/>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
            
            <!-- Bold & Slick "T" Typography -->
            <text x="50" y="68" 
                  font-size="54" 
                  font-family="'Montserrat', sans-serif" 
                  font-weight="900" 
                  text-anchor="middle" 
                  fill="rgba(0,0,0,0.8)" 
                  filter="url(#inset-shadow-t)"
                  letter-spacing="2">T</text>
        </svg>
    `;

    return { f: headsSVG, b: tailsSVG };
}

export function renderCoins(coins, selectedCoinIndex, selectCoinCallback) {
    const table = document.getElementById('table');
    table.innerHTML = '';
    
    coins.forEach((coinData, index) => {
        const val = valueTiers[coinData.valueIdx];
        const designs = getCoinDesigns();
        
        // Define dynamic metal classes based on value progression
        let metalClass = 'coin-copper'; 
        if (val >= 1.00) metalClass = 'coin-gold';
        else if (val >= 0.05) metalClass = 'coin-silver';
        
        // Adjust physical size mapping
        let size = 100;
        if(val == 0.10) size = 85;
        if(val == 0.25) size = 110;
        if(val == 0.50) size = 120;
        if(val >= 1.00) size = 130;

        const wrapper = document.createElement('div');
        wrapper.className = `coin-wrapper ${index === selectedCoinIndex ? 'selected' : ''}`;
        wrapper.onclick = () => selectCoinCallback(index);
        
        // Construct the 3D object: Shadow -> Inner Slices (Depth) -> Front/Back Faces -> Dynamic Shines
        let htmlContent = `
            <div class="coin-shadow" id="shadow-${index}" style="width: ${size}px; height: ${size/5}px;"></div>
            <div class="coin" id="coin-${index}" style="width:${size}px; height:${size}px; transform: rotateX(${coinData.rotation}deg)">
        `;

        // Generate 6 stacked planes spaced 1px apart to create the thick reeded edge
        for (let i = 1; i <= 6; i++) {
            htmlContent += `<div class="coin-edge ${metalClass}" style="transform: translateZ(${i}px);"></div>`;
        }

        // Front Face (pushed out to 7px) with SVG and independent Shine layer
        htmlContent += `
                <div class="coin-face ${metalClass}" style="transform: translateZ(7px);">
                    ${designs.f}
                    <div class="shine" id="shine-f-${index}"></div>
                </div>
        `;
        
        // Back Face (pushed inward to 0px, flipped 180deg) with SVG and independent Shine layer
        htmlContent += `
                <div class="coin-face coin-back ${metalClass}" style="transform: rotateX(180deg) translateZ(0px);">
                    ${designs.b}
                    <div class="shine" id="shine-b-${index}"></div>
                </div>
            </div>
        `;

        wrapper.innerHTML = htmlContent;
        table.appendChild(wrapper);
    });

    const addBtn = document.getElementById('addCoinBtn');
    if (addBtn) {
        addBtn.style.display = coins.length >= 5 ? 'none' : 'flex';
    }
}

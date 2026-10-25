// Handles 3D coin mechanics, custom AI-styled SVG faces, and 3D layering

import { valueTiers } from './upgrades.js';

// Custom SVG generator for Heads and Tails (Replaces Wikimedia images)
export function getCoinDesigns() {
    // Carved Crown & Gear emblem with CSS-friendly translucent shading for deep embossing
    const headsSVG = `
        <svg viewBox="0 0 100 100" class="coin-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <path id="heads-text-arc" d="M 15 50 A 35 35 0 1 1 85 50" fill="transparent"/>
                <filter id="inset-shadow">
                    <feOffset dx="0" dy="1"/>
                    <feGaussianBlur stdDeviation="0.5" result="offset-blur"/>
                    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                    <feFlood flood-color="black" flood-opacity="0.7" result="color"/>
                    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                    <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                </filter>
            </defs>
            <!-- Outer Gear Rim -->
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(0,0,0,0.6)" stroke-width="1.5" stroke-dasharray="4 2"/>
            <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
            
            <!-- Raised Text -->
            <text font-size="9" font-family="Montserrat" font-weight="900" fill="rgba(0,0,0,0.75)" filter="url(#inset-shadow)">
                <textPath href="#heads-text-arc" startOffset="50%" text-anchor="middle">CJ COIN APP</textPath>
            </text>
            
            <!-- 3D Fantasy Crown -->
            <path d="M 28 65 L 35 35 L 50 50 L 65 35 L 72 65 Z" fill="rgba(0,0,0,0.15)" stroke="rgba(0,0,0,0.7)" stroke-width="1.5" filter="url(#inset-shadow)"/>
            <path d="M 28 65 L 35 35 L 50 50 L 65 35 L 72 65 Z" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.5" transform="translate(0, -1)"/>
            
            <!-- Base Jewels -->
            <circle cx="35" cy="60" r="2" fill="rgba(0,0,0,0.6)"/>
            <circle cx="50" cy="60" r="2.5" fill="rgba(0,0,0,0.6)"/>
            <circle cx="65" cy="60" r="2" fill="rgba(0,0,0,0.6)"/>
        </svg>
    `;

    // Geometric Star & Vault design
    const tailsSVG = `
        <svg viewBox="0 0 100 100" class="coin-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <path id="tails-text-arc" d="M 85 50 A 35 35 0 1 1 15 50" fill="transparent"/>
                <filter id="inset-shadow-tails">
                    <feOffset dx="0" dy="1"/>
                    <feGaussianBlur stdDeviation="0.5" result="offset-blur"/>
                    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                    <feFlood flood-color="black" flood-opacity="0.7" result="color"/>
                    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                    <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
                </filter>
            </defs>
            <!-- Geometric Border -->
            <polygon points="50,5 93,25 93,75 50,95 7,75 7,25" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="1.5"/>
            <circle cx="50" cy="50" r="43" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="0.5"/>
            
            <!-- Raised Text -->
            <text font-size="9" font-family="Montserrat" font-weight="900" fill="rgba(0,0,0,0.75)" filter="url(#inset-shadow-tails)">
                <textPath href="#tails-text-arc" startOffset="50%" text-anchor="middle">FLIP TO WIN</textPath>
            </text>
            
            <!-- Interlocking Star/Vault -->
            <polygon points="50,25 58,42 75,42 62,52 66,68 50,58 34,68 38,52 25,42 42,42" fill="rgba(0,0,0,0.15)" stroke="rgba(0,0,0,0.7)" stroke-width="1.5" filter="url(#inset-shadow-tails)"/>
            <circle cx="50" cy="50" r="8" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
            <circle cx="50" cy="50" r="4" fill="rgba(0,0,0,0.6)"/>
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

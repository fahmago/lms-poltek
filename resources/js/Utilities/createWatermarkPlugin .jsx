// ✅ Konfigurasi global watermark (variabel publik)
export const watermarkConfig = {
    text: 'www.febryann.my.id',
    fontRatio: 30,
    opacity: 0.08,
    color: '#000000',
    rotate: 0, // derajat rotasi (0 = lurus)
    position: 'center', // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'right-center', dll
    textBaseline: 'middle', // bisa 'top', 'middle', atau 'bottom'
};

// ✅ Fungsi pembuat plugin watermark
export const createWatermarkPlugin = ({
    text = watermarkConfig.text,
    fontRatio = watermarkConfig.fontRatio,
    opacity = watermarkConfig.opacity,
    color = watermarkConfig.color,
    rotate = watermarkConfig.rotate,
    position = watermarkConfig.position,
    textBaseline = watermarkConfig.textBaseline,
} = {}) => {
    return {
        id: 'watermark',
        beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const { width, height } = chart;

            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.fillStyle = color;
            ctx.font = `${Math.round(width / fontRatio)}px Gabarito, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = textBaseline;

            // Tentukan posisi berdasarkan parameter
            let x = width / 2;
            let y = height / 2;
            switch (position) {
                case 'top-left': x = 50; y = 50; break;
                case 'top-right': x = width - 50; y = 50; break;
                case 'bottom-left': x = 50; y = height - 50; break;
                case 'bottom-right': x = width - 50; y = height - 50; break;
                case 'right-center': x = width - 40; y = height / 2; break;
                case 'left-center': x = 40; y = height / 2; break;
                default: break; // center
            }

            // Rotasi dan render teks
            ctx.translate(x, y);
            ctx.rotate((rotate * Math.PI) / 180);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
    };
};

export const createWatermarkPlugin2 = (text = 'www.febryann.my.id', options = {}) => {
    const {
        opacity = 0.08,
        fontRatio = 25, // semakin besar semakin kecil
        spacing = 0.1, // letter spacing
        color = '#000000',
        fontFamily = 'Gabarito, sans-serif',
    } = options;

    return {
        id: 'watermark',
        beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const { width, height } = chart;

            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = color;

            const fontSize = Math.round(width / fontRatio);
            const letterSpacing = fontSize * spacing;
            ctx.font = `${fontSize}px ${fontFamily}`;

            const textWidth = ctx.measureText(text).width + (text.length - 1) * letterSpacing;
            let startX = (width - textWidth) / 2;
            const y = height / 2;

            for (let i = 0; i < text.length; i++) {
                ctx.fillText(text[i], startX, y);
                startX += ctx.measureText(text[i]).width + letterSpacing;
            }

            ctx.restore();
        }
    };
};

export const createWatermarkPlugin3 = (text = 'www.febryann.my.id', fontRatio = 25) => {
    return {
        id: 'watermark',
        beforeDraw: (chart) => {
            const ctx = chart.ctx;
            const { width, height } = chart;
            ctx.save();
            ctx.globalAlpha = 0.08;
            ctx.translate(width / 2, height / 2);
            // ctx.rotate(-Math.PI / 6); // Rotasi 30 derajat
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `${Math.round(width / fontRatio)}px Gabarito, sans-serif`;
            ctx.fillStyle = '#000000';
            ctx.fillText(text, 0, 0);
            ctx.restore();
        }
    };
};

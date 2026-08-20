import React, {FC, SVGProps} from 'react';

/** Иконки инлайном, без библиотеки: их с десяток, и все простые.
 *  Пакет иконок весил бы больше, чем весь этот файл. */

type IconProps = SVGProps<SVGSVGElement>;

const base:IconProps = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
};

export const CloseIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
);

export const PlusIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <path d="M12 5v14M5 12h14"/>
    </svg>
);

export const MinusIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <path d="M5 12h14"/>
    </svg>
);

export const ChatIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <path
            d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-4-.9L3 21l1.9-4.9a8.4 8.4 0 0 1 3.7-11.4 8.9 8.9 0 0 1 4-.9 8.4 8.4 0 0 1 8.4 8.4z"/>
    </svg>
);

export const PhoneIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <path
            d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>
    </svg>
);

export const MailIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m2 7 10 6 10-6"/>
    </svg>
);

export const PinIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

export const ClockIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 7v5l3 2"/>
    </svg>
);

export const ArrowLeftIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
);

export const ArrowRightIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
);

export const MenuIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <path d="M4 7h16M4 12h16M4 17h16"/>
    </svg>
);

/** Иконки соцсетей заливкой, а не обводкой: логотипы узнаются формой. */
const filled:IconProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true,
};

export const TelegramIcon:FC<IconProps> = (props) => (
    <svg {...filled} {...props}>
        <path
            d="M21.9 4.3 18.7 19c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.3-.1-.5-.6-.2l-11.1 7-4.8-1.5c-1-.3-1-1 .2-1.5l18.8-7.2c.9-.3 1.6.2 1.3 1.5z"/>
    </svg>
);

export const WhatsappIcon:FC<IconProps> = (props) => (
    <svg {...filled} {...props}>
        <path
            d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a15 15 0 0 1-6.4-5.6c-.5-.7-.8-1.5-.8-2.3 0-.9.4-1.6.9-2 .2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.4l.8 1.9c0 .2 0 .3-.1.5l-.4.5c-.1.2-.3.3-.1.6a9 9 0 0 0 4 3.5c.3.1.4.1.6-.1l.8-.9c.2-.2.3-.2.6-.1l1.8.9c.3.1.4.2.5.3v1z"/>
    </svg>
);

export const VkIcon:FC<IconProps> = (props) => (
    <svg {...filled} {...props}>
        <path
            d="M12.8 16.7c-5 0-8.2-3.5-8.3-9.2h2.6c.1 4.2 2 6 3.4 6.4V7.5h2.4v3.7c1.4-.2 2.9-1.8 3.4-3.7h2.4a6.8 6.8 0 0 1-3.1 4.4 7 7 0 0 1 3.6 4.8h-2.6c-.5-1.6-1.8-2.9-3.7-3.1v3.1h-.1z"/>
    </svg>
);

export const YoutubeIcon:FC<IconProps> = (props) => (
    <svg {...filled} {...props}>
        <path
            d="M22.5 7.2a2.7 2.7 0 0 0-1.9-1.9C18.9 4.8 12 4.8 12 4.8s-6.9 0-8.6.5A2.7 2.7 0 0 0 1.5 7.2 28 28 0 0 0 1 12a28 28 0 0 0 .5 4.8 2.7 2.7 0 0 0 1.9 1.9c1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5a2.7 2.7 0 0 0 1.9-1.9A28 28 0 0 0 23 12a28 28 0 0 0-.5-4.8zM9.8 15.3V8.7l5.7 3.3-5.7 3.3z"/>
    </svg>
);

export const GlobeIcon:FC<IconProps> = (props) => (
    <svg {...base} {...props}>
        <circle cx="12" cy="12" r="9"/>
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>
    </svg>
);

/** Значок картографической службы для кнопки «Как доехать».
 *
 *  Не воспроизведение чужого логотипа, а свой значок в фирменном цвете
 *  службы: плитка её цвета с белой меткой внутри. Рядом с названием
 *  («2ГИС», «Яндекс Карты») цвет узнаётся сразу, а перерисовывать чужие
 *  товарные знаки по памяти — верный способ нарисовать их неправильно.
 *
 *  Цвет приходит снаружи: список служб и их палитра живут в блоке карты,
 *  и держать их в двух местах незачем. */
export const MapServiceIcon:FC<IconProps&{ color:string }> = ({
                                                                  color,
                                                                  ...props
                                                              }) => (
    <svg width={20} height={20} viewBox="0 0 24 24" aria-hidden {...props}>
        <rect x="2" y="2" width="20" height="20" rx="6" fill={color}/>
        <path
            d="M12 6.6a4 4 0 0 0-4 4c0 2.9 4 6.8 4 6.8s4-3.9 4-6.8a4 4 0 0 0-4-4zm0 5.6a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4z"
            fill="#ffffff"
        />
    </svg>
);

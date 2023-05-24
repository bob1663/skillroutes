import React from 'react';
export default function useResizer() {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
    function handleSizeChange() {
        return setIsMobile(window.innerWidth < 768);
    }

    React.useEffect(() => {
        window.addEventListener('resize', handleSizeChange);

        return () => {
            window.removeEventListener('resize', handleSizeChange);
        };
    }, [isMobile]);

    return isMobile;
}

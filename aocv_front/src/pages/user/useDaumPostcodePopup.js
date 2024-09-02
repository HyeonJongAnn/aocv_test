import { useCallback } from 'react';

const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

const useDaumPostcodePopup = (scriptUrl) => {
  const open = useCallback(({ onComplete }) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    document.body.appendChild(script);

    script.onload = () => {
      new window.daum.Postcode({
        oncomplete: (data) => {
          onComplete(data);
        },
      }).open();
    };
  }, [scriptUrl]);

  return open;
};

export default useDaumPostcodePopup;

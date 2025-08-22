import WhatsAppWidget from "react-whatsapp-chat-widget";
import "react-whatsapp-chat-widget/index.css";
const FloatingChatButton = () => {
  return (
    <WhatsAppWidget
      phoneNo="447878619356"
      position="right"
      widgetWidth="300px"
      widgetWidthMobile="260px"
      messageBox={true}
      iconSize="40"
      iconColor="white"
      iconBgColor="tomato"
      headerIcon="/logo-secondary.jpg"
      headerIconColor="pink"
      headerTxtColor="black"
      headerBgColor="tomato"
      
    />
  );
};

export default FloatingChatButton;

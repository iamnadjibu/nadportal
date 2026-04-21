import SharedContentPage from '../../components/SharedContentPage';

export default function Websites() {
    return (
        <SharedContentPage 
            typeFilter="WEBSITE" 
            pageTitle="WEBSITES" 
            subtitle="Infrastructure Node Control" 
            isWebsite={true}
        />
    );
}

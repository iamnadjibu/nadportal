import SharedContentPage from '../../components/SharedContentPage';

export default function Films() {
    return (
        <SharedContentPage 
            typeFilter={['FILM', 'AI FILM', 'SHORT FILM']} 
            pageTitle="FILMS" 
            subtitle="Narrative Production Nodes" 
        />
    );
}

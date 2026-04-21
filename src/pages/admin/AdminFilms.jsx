import AdminSharedList from '../../components/AdminSharedList';

export default function AdminFilms() {
    return (
        <AdminSharedList 
            typeFilter={['FILM', 'AI FILM', 'SHORT FILM']} 
            pageTitle="FILM" 
            subtitle="Production Lifecycle Control" 
        />
    );
}

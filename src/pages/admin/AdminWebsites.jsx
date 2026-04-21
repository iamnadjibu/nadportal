import AdminSharedList from '../../components/AdminSharedList';

export default function AdminWebsites() {
    return (
        <AdminSharedList 
            typeFilter="WEBSITE" 
            pageTitle="WEBSITE" 
            subtitle="Infrastructure Control" 
            isWebsite={true}
        />
    );
}

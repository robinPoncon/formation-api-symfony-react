import React, {useEffect, useState} from 'react';
import Pagination from '../components/Pagination';
import moment from "moment";
import invoicesAPI from "../services/invoicesAPI";

const STATUS_CLASSES = {
    PAID: "success", 
    SENT: "info",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée" 
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;

    const fetchInvoices = async () => {
        try {
            const data = await invoicesAPI.findAll();
            setInvoices(data);
        }
        catch (error) {
            console.log(error.response);
        }
    }

    // Charger les invoices au chargement du composant
    useEffect(() => {
        fetchInvoices();
    } ,[]);

    // Gestion du format de la date
    const formatDate = (str) => moment(str).format("DD/MM/YYYY");

    // Gestion de la suppression 
    const handleDelete = async (id) => {
        // On fait une copie du tableau des invoices
        const originalInvoices = [...invoices];

        // On fait un nouveau tableau dans lequel on supprime la facture correspondant à l'id
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await invoicesAPI.delete(id);
        } 
        catch(error) {
            setInvoices(originalInvoices);
        }
    }

    // Gestion du changement de page 
    const handlePageChanged = (page) => setCurrentPage(page);
    
    // Gestion de la recherche 
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    // Filtrage des invoices en fonction de la recherche
    const filteredInvoices = invoices.filter(
        i => 
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    // Pagination des données
    const paginatedInvoices = Pagination.getData(
        filteredInvoices, 
        currentPage, 
        itemsPerPage
    );

    return ( 
        <>
            <h1>Liste des factures</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => 
                        <tr key={invoice.id}>
                            <td>{invoice.chrono}</td>
                            <td>
                                <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                            </td>
                            <td className="text-center">{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span className={"badge bg-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                            <td>
                                <button className="btn btn-sm btn-primary mr-10">Editer</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChanged} length={filteredInvoices.length}></Pagination>
        </> 
    );
}
 
export default InvoicesPage;
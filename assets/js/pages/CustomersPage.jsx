import React, {useEffect, useState} from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";

const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // Permet d'aller récupérer les customers
    const fetchCustomers = async () => {
        // Première façon de faire une requête avec les promesses
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
        }
        catch(error) {
            console.log(error.response);
        }

        // Deuxième façon de faire une requête avec les promesses
            // CustomersAPI.findAll()
            //     .then(data => setCustomers(data))
            //     .catch(error => console.log(error.response));
    }

    // Au chargement du composant, on va chercher les customers
    useEffect(() => fetchCustomers(), []);

    // Gestion de la suppression d'un customer
    const handleDelete = async (id) => {
        // On fait une copie du tableau des customers
        const originalCustomers = [...customers];

        // On fait un nouveau tableau dans lequel on supprime le customer correspondant à l'id
        setCustomers(customers.filter(customer => customer.id !== id));

        // Première façon de faire une requête avec les promesses
        try {
            await CustomersAPI.delete(id)
        } 
        catch(error) {
            setCustomers(originalCustomers);
        }
        // Deuxième façon de faire une requête avec les promesses
            // CustomersAPI.delete(id)
            // .then(response => console.log("ok"))
            // .catch(error => {
            //     setCustomers(originalCustomers);
            //     console.log(error.response);
            // });
    }

    // Gestion du changement de page 
    const handlePageChanged = (page) => setCurrentPage(page);
    
    // Gestion de la recherche 
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    const itemsPerPage = 10;

    // Filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        c => 
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.company.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination des données
    const paginatedCustomers = Pagination.getData(
        filteredCustomers, 
        currentPage, 
        itemsPerPage
    );

    return ( 
        <>
            <h1>Liste des clients</h1>

            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {paginatedCustomers.map(customer => 
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center"><span className="badge badge-light">{customer.invoices.length}</span></td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                            <td><button 
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0} 
                                className="btn btn-sm btn-danger">Supprimer
                            </button></td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            {itemsPerPage < filteredCustomers.length && <Pagination 
                currentPage={currentPage} itemsPerPage={itemsPerPage} 
                length={filteredCustomers.length} onPageChanged={handlePageChanged}
            />}
            
        </>
    );
}
 
export default CustomersPage;
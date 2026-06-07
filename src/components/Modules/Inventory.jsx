import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import { Search, Plus, Filter, AlertTriangle } from 'lucide-react';
import FilterModal from '../Shared/FilterModal';

const Inventory = () => {
    const { inventory, updateStock, updateThreshold } = useHealth();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter State
    const [showFilter, setShowFilter] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);

    // Unique Categories + Statuses for Filter
    const filterOptions = [
        'Status: LOW', 'Status: OK',
        ...Array.from(new Set(inventory.map(i => `Category: ${i.category}`)))
    ];

    const handleFilterSelect = (opt) => {
        if (selectedFilters.includes(opt)) {
            setSelectedFilters(selectedFilters.filter(f => f !== opt));
        } else {
            setSelectedFilters([...selectedFilters, opt]);
        }
    };

    const filteredItems = inventory.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());

        if (selectedFilters.length === 0) return matchesSearch;

        const statusMatch = selectedFilters.includes(`Status: ${item.status}`);
        const categoryMatch = selectedFilters.includes(`Category: ${item.category}`);

        const hasStatusFilter = selectedFilters.some(f => f.startsWith('Status:'));
        const hasCategoryFilter = selectedFilters.some(f => f.startsWith('Category:'));

        if (hasStatusFilter && hasCategoryFilter) return matchesSearch && (statusMatch && categoryMatch);
        if (hasStatusFilter) return matchesSearch && statusMatch;
        if (hasCategoryFilter) return matchesSearch && categoryMatch;

        return matchesSearch;
    });

    return (
        <div style={{ padding: '0 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Inventory Management</h1>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#666' }} />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                background: '#27272A', border: 'none', padding: '10px 10px 10px 40px', borderRadius: '6px', color: '#fff', outline: 'none', width: '300px'
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            style={{
                                background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)',
                                padding: '0.5rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}>
                            <Filter size={18} /> Filter
                        </button>
                        <FilterModal
                            isOpen={showFilter}
                            onClose={() => setShowFilter(false)}
                            options={filterOptions}
                            selected={selectedFilters}
                            onSelect={handleFilterSelect}
                            onClear={() => setSelectedFilters([])}
                        />
                    </div>

                    <button style={{
                        background: 'var(--primary-color)', border: 'none', color: '#000',
                        padding: '0.5rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold'
                    }}>
                        <Plus size={18} /> Add Item
                    </button>
                </div>
            </div>

            <div style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#1E1E1E', color: '#888', fontSize: '0.9rem' }}>
                            <th style={{ padding: '1rem' }}>Medicine Name</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Min Limit</th>
                            <th style={{ padding: '1rem' }}>Stock Level</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item, idx) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #222', background: idx % 2 === 0 ? 'transparent' : '#181818' }}>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{item.name}</td>
                                <td style={{ padding: '1rem', color: '#aaa' }}>{item.category}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        color: item.status === 'LOW' ? 'var(--primary-color)' : '#fff'
                                    }}>
                                        {item.status === 'LOW' && <AlertTriangle size={14} />}
                                        {item.status}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {/* Threshold Edit */}
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.threshold !== undefined ? item.threshold : 10}
                                        onChange={(e) => updateThreshold(item.id, Math.max(0, parseInt(e.target.value) || 0))}
                                        style={{
                                            width: '60px', padding: '6px', background: 'transparent', border: '1px solid #444',
                                            color: '#aaa', borderRadius: '4px', textAlign: 'center'
                                        }}
                                    />
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {/* Stock Edit */}
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.stock}
                                        onChange={(e) => updateStock(item.id, Math.max(0, parseInt(e.target.value) || 0))}
                                        style={{
                                            width: '80px', padding: '8px', background: '#333', border: '1px solid #444',
                                            color: '#fff', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold'
                                        }}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;

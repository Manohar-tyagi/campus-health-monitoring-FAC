import React from 'react';

const FilterModal = ({ isOpen, onClose, options, selected, onSelect, onClear }) => {
    if (!isOpen) return null;

    const handleCheckboxChange = (opt) => {
        onSelect(opt);
    };

    return (
        <div style={{
            position: 'absolute', top: '50px', right: '0', zIndex: 100,
            background: '#1E1E1E', border: '1px solid #333', borderRadius: '8px', padding: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)', width: '200px'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.9rem', color: '#fff' }}>Filter By</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                {options.map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#ccc' }}>
                        <input
                            type="checkbox"
                            checked={selected.includes(opt)}
                            onChange={() => handleCheckboxChange(opt)}
                            style={{ accentColor: 'var(--primary-color)' }}
                        />
                        {opt}
                    </label>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #333' }}>
                <button
                    onClick={onClear}
                    style={{ flex: 1, fontSize: '0.8rem', background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: '4px', padding: '6px', cursor: 'pointer' }}>
                    Clear
                </button>
                <button
                    onClick={onClose}
                    style={{ flex: 1, fontSize: '0.8rem', background: 'var(--primary-color)', border: 'none', color: '#000', borderRadius: '4px', padding: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Done
                </button>
            </div>
        </div>
    );
};

export default FilterModal;

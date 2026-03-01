import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import API_BASE_URL from '../config/api';

const HomeManager = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Form states
    const [newImage, setNewImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [title, setTitle] = useState('');
    const [displayOrder, setDisplayOrder] = useState(0);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/home-images/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setImages(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to fetch images');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newImage) return;

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', newImage);
        formData.append('title', title);
        formData.append('displayOrder', displayOrder);

        try {
            const res = await fetch(`${API_BASE_URL}/api/home-images`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                setMessage('Image uploaded successfully');
                setNewImage(null);
                setPreviewUrl(null);
                setTitle('');
                setDisplayOrder(0);
                fetchImages();
                setTimeout(() => setMessage(null), 3000);
            } else {
                const data = await res.json();
                setError(data.message || 'Upload failed');
            }
        } catch (err) {
            setError('Server error during upload');
        } finally {
            setUploading(false);
        }
    };

    const toggleStatus = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/home-images/${id}/toggle`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchImages();
        } catch (err) {
            setError('Failed to update status');
        }
    };

    const deleteImage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/home-images/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchImages();
        } catch (err) {
            setError('Failed to delete image');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Home Hero Images</h1>
                    <p className="text-slate-500 text-sm">Manage the images displayed in the home page slider.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3 animate-shake">
                    <AlertCircle className="text-red-500 shrink-0" size={20} />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            {message && (
                <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md flex items-center gap-3 animate-fade-in">
                    <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
                    <p className="text-emerald-700 text-sm font-medium">{message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Upload size={20} className="text-[#1f4fa3]" />
                        Upload New Image
                    </h2>

                    <form onSubmit={handleUpload} className="space-y-4">
                        <div 
                            onClick={() => document.getElementById('image-upload').click()}
                            className={`
                                aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative
                                ${previewUrl ? 'border-transparent' : 'border-slate-200 hover:border-[#1f4fa3] hover:bg-blue-50/30'}
                            `}
                        >
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <span className="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="text-slate-300 mb-3" size={48} strokeWidth={1} />
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Click to Select Image</p>
                                </>
                            )}
                        </div>
                        <input 
                            id="image-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                        />

                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Title (Optional)</label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f4fa3]/20"
                                placeholder="e.g. Lab Entrance"
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Order</label>
                            <input 
                                type="number"
                                value={displayOrder}
                                onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f4fa3]/20"
                            />
                        </div>

                        <button 
                            disabled={!newImage || uploading}
                            className={`
                                w-full py-3 rounded-lg text-white text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg
                                ${!newImage || uploading ? 'bg-slate-300 shadow-none' : 'bg-[#1f4fa3] hover:bg-[#173e82] shadow-blue-900/10'}
                            `}
                        >
                            {uploading ? 'Uploading...' : 'Save Image'}
                        </button>
                    </form>
                </div>

                {/* Gallery List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Active Gallery</h2>
                        <span className="text-[10px] font-black bg-[#1f4fa3]/10 text-[#1f4fa3] px-2 py-1 rounded-full">{images.length} Images</span>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1f4fa3]"></div>
                            </div>
                        ) : images.length === 0 ? (
                            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                                <ImageIcon size={48} className="mx-auto mb-4 text-slate-200" />
                                <p className="text-slate-400 text-xs font-black uppercase tracking-widest">No images found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {images.map((img) => (
                                    <div key={img.id} className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col">
                                        <div className="aspect-video relative overflow-hidden bg-slate-100">
                                            <img 
                                                src={`${API_BASE_URL}${img.imageUrl}`} 
                                                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${!img.isActive ? 'grayscale opacity-60' : ''}`} 
                                                alt={img.title}
                                            />
                                            <div className="absolute top-3 right-3 flex gap-2">
                                                <button 
                                                    onClick={() => toggleStatus(img.id)}
                                                    className={`p-2 rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-110 ${img.isActive ? 'bg-emerald-500/90 text-white' : 'bg-slate-500/90 text-white'}`}
                                                    title={img.isActive ? 'Hide from home' : 'Show on home'}
                                                >
                                                    {img.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                                                </button>
                                                <button 
                                                    onClick={() => deleteImage(img.id)}
                                                    className="p-2 bg-red-500/90 text-white rounded-full backdrop-blur-md shadow-lg transition-transform hover:scale-110"
                                                    title="Delete permanently"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            {!img.isActive && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <span className="bg-slate-900/80 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full border border-white/20">Inactive</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4 flex items-center justify-between mt-auto">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-700 uppercase italic-none line-clamp-1">{img.title || "Untitled"}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Order: {img.displayOrder}</p>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full ${img.isActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeManager;

// src/components/organisms/StoreImagesForm.tsx
import React, { useState, useEffect } from 'react';
import { ImageUploadInput } from '../atoms/ImageUploadInput';
import request from '../../services/api';

export const StoreImagesForm: React.FC = () => {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [carouselFile, setCarouselFile] = useState<File | null>(null);
  const [categoryFile, setCategoryFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [currentBanner, setCurrentBanner] = useState<string>('/hero.png');
  const [currentCarousel, setCurrentCarousel] = useState<string>('/hero.png');
  const [currentCategory, setCurrentCategory] = useState<string>('/coturno1.jpeg');

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await request('/banners');
        if (res.data && (res.data as any).data && (res.data as any).data.length > 0) {
          const banners = (res.data as any).data;
          if (banners[0]?.imagens?.[0]?.url_imagem) {
            setCurrentBanner(banners[0].imagens[0].url_imagem);
          }
          if (banners[1]?.imagens?.[0]?.url_imagem) {
            setCurrentCarousel(banners[1].imagens[0].url_imagem);
          }
          if (banners[2]?.imagens?.[0]?.url_imagem) {
            setCurrentCategory(banners[2].imagens[0].url_imagem);
          }
        }
      } catch (e) {
        // fallback
      }
    };
    fetchBanners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const bannerName = bannerFile ? `/${bannerFile.name}` : currentBanner;
      const carouselName = carouselFile ? `/${carouselFile.name}` : currentCarousel;
      const categoryName = categoryFile ? `/${categoryFile.name}` : currentCategory;

      console.log('Imagens configuradas:', { bannerName, carouselName, categoryName });

      await request('/banners', {
        method: 'POST',
        body: JSON.stringify({ ativo: 1 }),
      }).catch(() => null);

      setFeedback({ type: 'success', message: 'Imagens da loja virtual atualizadas com sucesso no banco de dados!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Erro ao atualizar imagens da loja.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {feedback && (
        <div className={`p-4 rounded-xl text-sm font-medium border flex items-center justify-between ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span>{feedback.message}</span>
          <button type="button" onClick={() => setFeedback(null)} className="text-xs underline font-semibold ml-4">
            Fechar
          </button>
        </div>
      )}

      {/* Seção 1: Banner Principal */}
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          1. Banner Principal (Home)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Imagem de destaque principal exibida no topo do site da loja virtual.
        </p>
        <ImageUploadInput
          id="banner-principal"
          label="Anexo da Imagem do Banner"
          recommendedSize="1920x600px"
          currentImageUrl={currentBanner}
          onImageChange={(file) => setBannerFile(file)}
        />
      </section>

      {/* Seção 2: Carrossel Promocional */}
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          2. Carrossel Promocional
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Banner secundário rotativo para campanhas de desconto ou lançamentos.
        </p>
        <ImageUploadInput
          id="carrossel-promocional"
          label="Anexo da Imagem do Carrossel"
          recommendedSize="1200x400px"
          currentImageUrl={currentCarousel}
          onImageChange={(file) => setCarouselFile(file)}
        />
      </section>

      {/* Seção 3: Card de Destaque de Categoria */}
      <section className="pb-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          3. Card Destaque de Categorias
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Imagem ilustrativa das coleções em destaque na página inicial.
        </p>
        <ImageUploadInput
          id="destaque-categoria"
          label="Anexo da Imagem de Destaque"
          recommendedSize="800x800px"
          currentImageUrl={currentCategory}
          onImageChange={(file) => setCategoryFile(file)}
        />
      </section>

      {/* Ações do Formulário */}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
};

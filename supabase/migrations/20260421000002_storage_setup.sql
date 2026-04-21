-- 1. Criar o bucket 'characters' se não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('characters', 'characters', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de Segurança para o bucket 'characters'
-- Permitir que qualquer pessoa veja as imagens (Público)
CREATE POLICY "Imagens de personagens são públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'characters');

-- Permitir que qualquer pessoa autenticada (ou você via portal) suba imagens
-- Nota: Em produção, o ideal é restringir mais, mas para o Pre-Alpha manteremos simples
CREATE POLICY "Qualquer um pode subir imagens"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'characters');

CREATE POLICY "Qualquer um pode deletar imagens"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'characters');

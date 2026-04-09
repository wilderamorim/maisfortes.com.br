import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Termos de Uso",
  description: "Termos de uso da plataforma +Fortes.",
};

export default function TermosPage() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Termos de Uso
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Última atualização: 09 de abril de 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>1. Aceitação dos Termos</h2>
            <p>Ao acessar ou usar a plataforma +Fortes ("Plataforma"), disponível em maisfortes.com.br, você concorda com estes Termos de Uso. Se não concordar, não utilize a Plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>2. Descrição do Serviço</h2>
            <p>O +Fortes é uma plataforma gratuita e open-source que permite aos usuários registrar check-ins diários, acompanhar streaks de consistência, convidar apoiadores para sua jornada de mudança comportamental e desbloquear conquistas. A Plataforma não substitui acompanhamento médico, psicológico ou terapêutico profissional.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>3. Cadastro e Conta</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Você deve fornecer informações verdadeiras ao se cadastrar.</li>
              <li>Você é responsável por manter a segurança de sua senha.</li>
              <li>Você deve ter pelo menos 13 anos de idade para usar a Plataforma.</li>
              <li>Uma conta por pessoa. Contas duplicadas podem ser removidas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>4. Uso Aceitável</h2>
            <p>Ao usar a Plataforma, você concorda em:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Não usar a Plataforma para assediar, intimidar ou monitorar alguém sem consentimento.</li>
              <li>Não compartilhar dados de outros usuários sem autorização.</li>
              <li>Não tentar acessar dados de outros usuários ou comprometer a segurança da Plataforma.</li>
              <li>Não usar a Plataforma para fins ilegais.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>5. Conteúdo do Usuário</h2>
            <p>Você é responsável por todo conteúdo que insere na Plataforma (notas, mensagens, metas). O +Fortes não monitora proativamente o conteúdo, mas se reserva o direito de remover conteúdo que viole estes termos.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>6. Privacidade</h2>
            <p>Seus dados são tratados conforme nossa <Link href="/privacidade" className="underline" style={{ color: "var(--forest)" }}>Política de Privacidade</Link>. Resumindo: seus dados são seus, privados por padrão, e nunca serão vendidos.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>7. Gratuidade</h2>
            <p>O +Fortes é gratuito e não possui planos pagos, anúncios ou monetização de dados. O código-fonte é aberto sob licença MIT.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>8. Disponibilidade</h2>
            <p>O +Fortes é fornecido "como está". Não garantimos disponibilidade ininterrupta. Podemos descontinuar ou modificar a Plataforma a qualquer momento, com aviso prévio quando possível.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>9. Isenção de Responsabilidade</h2>
            <p>O +Fortes <strong>não é um serviço de saúde</strong>. Não oferecemos diagnóstico, tratamento ou aconselhamento médico/psicológico. Se você ou alguém que conhece precisa de ajuda profissional, procure um profissional de saúde qualificado. Em caso de emergência, ligue 192 (SAMU) ou 188 (CVV).</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>10. Exclusão de Conta</h2>
            <p>Você pode solicitar a exclusão da sua conta e todos os dados associados a qualquer momento através das configurações do perfil. A exclusão é irreversível.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>11. Alterações nos Termos</h2>
            <p>Podemos atualizar estes termos periodicamente. Notificaremos alterações significativas por email ou aviso na Plataforma. O uso continuado após alterações constitui aceitação dos novos termos.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>12. Contato</h2>
            <p>Para dúvidas sobre estes termos, entre em contato pelo repositório do projeto no <a href="https://github.com/wilderamorim/maisfortes.com.br/issues" target="_blank" rel="noopener" className="underline" style={{ color: "var(--forest)" }}>GitHub</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

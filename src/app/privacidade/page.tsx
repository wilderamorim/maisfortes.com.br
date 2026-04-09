import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade",
  description: "Política de privacidade da plataforma +Fortes.",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-dvh" style={{ background: "var(--bg)" }}>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>
          Política de Privacidade
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
          Última atualização: 09 de abril de 2026
        </p>

        <div className="rounded-xl p-5 mb-8" style={{ background: "rgba(45,106,79,0.06)", border: "1px solid rgba(45,106,79,0.15)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--forest)" }}>
            Resumo: Seus dados são seus. Privados por padrão. Nunca vendidos. Você controla tudo.
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>1. Quem Somos</h2>
            <p>O +Fortes é um projeto pessoal open-source, criado por Wilder Amorim, disponível em maisfortes.com.br. Esta política descreve como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>2. Dados que Coletamos</h2>
            <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>2.1 Dados fornecidos por você:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cadastro:</strong> Nome, email e senha (ou dados do Google, se usar login social).</li>
              <li><strong>Metas:</strong> Título e descrição das metas que você criar.</li>
              <li><strong>Check-ins:</strong> Score diário (1-5), humor e notas opcionais.</li>
              <li><strong>Mensagens:</strong> Mensagens de incentivo e reações enviadas entre usuários.</li>
              <li><strong>Foto de perfil:</strong> Opcional, enviada por você.</li>
            </ul>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: "var(--text)" }}>2.2 Dados coletados automaticamente:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dados técnicos:</strong> Tipo de dispositivo, navegador, sistema operacional (para garantir funcionamento do app).</li>
              <li><strong>Cookies essenciais:</strong> Para manter sua sessão autenticada e preferências de tema.</li>
            </ul>

            <h3 className="font-semibold mb-2 mt-4" style={{ color: "var(--text)" }}>2.3 Dados que NÃO coletamos:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Dados de localização</li>
              <li>Dados de navegação em outros sites</li>
              <li>Dados biométricos</li>
              <li>Cookies de rastreamento ou publicidade</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>3. Como Usamos seus Dados</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Funcionamento da plataforma:</strong> Autenticação, salvamento de check-ins, cálculo de streaks, desbloqueio de conquistas.</li>
              <li><strong>Rede de apoio:</strong> Compartilhar seu progresso apenas com apoiadores que você autorizar explicitamente.</li>
              <li><strong>Notificações:</strong> Enviar lembretes de check-in e alertas de inatividade (se você ativar).</li>
              <li><strong>Melhoria do produto:</strong> Dados agregados e anônimos para entender padrões de uso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>4. Compartilhamento de Dados</h2>
            <div className="rounded-xl p-4 mb-3" style={{ background: "rgba(244,132,95,0.06)", border: "1px solid rgba(244,132,95,0.15)" }}>
              <p className="font-semibold text-sm" style={{ color: "var(--coral)" }}>
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais. Nunca.
              </p>
            </div>
            <p>Seus dados são compartilhados apenas com:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Apoiadores que você autorizou:</strong> Apenas os dados que você permitir (score, notas), apenas das metas que você escolher.</li>
              <li><strong>Supabase:</strong> Nosso provedor de infraestrutura (banco de dados e autenticação), que processa dados sob contrato de proteção de dados.</li>
              <li><strong>Vercel:</strong> Nosso provedor de hospedagem, que processa requisições HTTP.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>5. Privacidade por Design</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Privado por padrão:</strong> Nenhum dado é público. Nenhum apoiador vê nada até você autorizar.</li>
              <li><strong>Granular por meta:</strong> Você controla por meta quem vê o quê. Uma meta pode ser visível para Maria e outra não.</li>
              <li><strong>Controle total:</strong> Você pode remover apoiadores, revogar acessos e excluir dados a qualquer momento.</li>
              <li><strong>Sem perfil público:</strong> Não existe perfil público, feed social ou descoberta de usuários.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>6. Segurança</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Autenticação segura via Supabase Auth (bcrypt para senhas).</li>
              <li>Row Level Security (RLS) no banco de dados — cada usuário só acessa seus próprios dados.</li>
              <li>Comunicação criptografada via HTTPS.</li>
              <li>Código-fonte aberto para auditoria pública.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>7. Seus Direitos (LGPD)</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Acesso:</strong> Saber quais dados temos sobre você.</li>
              <li><strong>Correção:</strong> Corrigir dados incorretos.</li>
              <li><strong>Exclusão:</strong> Solicitar a exclusão de todos os seus dados.</li>
              <li><strong>Portabilidade:</strong> Exportar seus dados em formato legível.</li>
              <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento.</li>
            </ul>
            <p className="mt-2">Para exercer esses direitos, use as opções em "Perfil → Configurações" ou abra uma issue no <a href="https://github.com/wilderamorim/maisfortes.com.br/issues" target="_blank" rel="noopener" className="underline" style={{ color: "var(--forest)" }}>GitHub</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>8. Cookies</h2>
            <p>Usamos apenas cookies essenciais:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Sessão de autenticação:</strong> Para manter você logado.</li>
              <li><strong>Preferência de tema:</strong> Para lembrar se você escolheu modo claro ou escuro.</li>
              <li><strong>Consentimento de cookies:</strong> Para lembrar sua escolha sobre cookies.</li>
            </ul>
            <p className="mt-2">Não usamos cookies de rastreamento, analytics de terceiros ou publicidade.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>9. Retenção de Dados</h2>
            <p>Seus dados são mantidos enquanto sua conta estiver ativa. Ao excluir sua conta, todos os dados são removidos permanentemente em até 30 dias.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>10. Dados de Menores</h2>
            <p>O +Fortes não é destinado a menores de 13 anos. Se tomarmos conhecimento de que coletamos dados de um menor de 13 anos, excluiremos a conta imediatamente.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>11. Alterações nesta Política</h2>
            <p>Podemos atualizar esta política periodicamente. Alterações significativas serão comunicadas por email ou aviso na Plataforma. A data de última atualização sempre estará visível no topo desta página.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3" style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>12. Contato</h2>
            <p>Para questões sobre privacidade, entre em contato pelo <a href="https://github.com/wilderamorim/maisfortes.com.br/issues" target="_blank" rel="noopener" className="underline" style={{ color: "var(--forest)" }}>GitHub</a> do projeto.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

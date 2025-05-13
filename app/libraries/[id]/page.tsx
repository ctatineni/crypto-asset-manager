"use client"

import { useParams, useRouter } from "next/navigation"
import { getLibrary, apps } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { AlertTriangle, ArrowLeft } from "lucide-react"

export default function LibraryDetail() {
  const params = useParams()
  const router = useRouter()
  const libId = params.id as string
  const library = getLibrary(libId)

  if (!library) {
    return (
      <div className="container max-w-7xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Library not found. The library you are looking for does not exist or has been removed.
          </AlertDescription>
        </Alert>

        <Button asChild>
          <Link href="/libraries">Return to Libraries</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{library.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
              {library.language}
            </Badge>
            <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800">
              {library.type}
            </Badge>
            <Badge
              className={
                library.vulnerabilities > 0
                  ? "bg-red-500"
                  : library.version !== library.latest_version
                  ? "bg-amber-500"
                  : "bg-green-500"
              }
            >
              {library.vulnerabilities > 0
                ? `${library.vulnerabilities} Vulnerabilities`
                : library.version !== library.latest_version
                ? "Update Available"
                : "Up to Date"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Library Overview</CardTitle>
              <CardDescription>Detailed information about this cryptographic library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Description</h3>
                  <p className="mt-1">{library.usage}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h3 className="font-medium">Current Version</h3>
                    <p className="text-2xl font-bold mt-1">{library.version}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h3 className="font-medium">Latest Version</h3>
                    <p className="text-2xl font-bold mt-1">{library.latest_version}</p>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                    <h3 className="font-medium">Applications Using</h3>
                    <p className="text-2xl font-bold mt-1">{library.apps_using.length}</p>
                  </div>
                </div>

                {library.vulnerabilities > 0 && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h3 className="font-medium text-red-800 dark:text-red-300">Security Vulnerabilities</h3>
                    <p className="text-sm mt-1 text-red-800 dark:text-red-300">
                      This library has {library.vulnerabilities} known vulnerabilities that need to be addressed.
                    </p>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="border-red-300 dark:border-red-800 text-red-800 dark:text-red-300">
                        View Vulnerabilities
                      </Button>
                    </div>
                  </div>
                )}

                {library.version !== library.latest_version && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <h3 className="font-medium text-amber-800 dark:text-amber-300">Update Available</h3>
                    <p className="text-sm mt-1 text-amber-800 dark:text-amber-300">
                      This library is using version {library.version} but version {library.latest_version} is available.
                      Updating is recommended to ensure you have the latest security patches.
                    </p>
                    <div className="mt-3">
                      <Button size="sm" variant="outline" className="border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                        View Update Guide
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applications Using This Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {library.apps_using.map((appId) => {
                  const app = apps.find((a) => a.id === appId);
                  if (!app) return null;
                  
                  return (
                    <div key={appId} className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{app.name}</h3>
                          <p className="text-sm text-slate-500 mt-1">{app.description}</p>
                        </div>
                        <Badge
                          className={
                            app.risk_score < 70
                              ? "bg-red-500"
                              : app.risk_score < 90
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }
                        >
                          Risk: {app.risk_score}/100
                        </Badge>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button size="sm" asChild>
                          <Link href={`/dashboard?appId=${app.id}`}>View Application</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Examples</CardTitle>
              <CardDescription>Secure usage examples for this library</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="secure">
                <TabsList className="mb-4">
                  <TabsTrigger value="secure">Secure Implementation</TabsTrigger>
                  <TabsTrigger value="insecure">Common Mistakes</TabsTrigger>
                  <TabsTrigger value="migration">Migration Guide</TabsTrigger>
                </TabsList>
                
                <TabsContent value="secure">
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {library.name === "OpenSSL" ? (
                      <>
                        <div className="text-slate-500">// Secure OpenSSL implementation</div>
                        <div className="text-green-400">
                          #include &lt;openssl/ssl.h&gt;<br />
                          #include &lt;openssl/err.h&gt;<br />
                          <br />
                          void initialize_ssl() {<br />\
                          &nbsp;&nbsp;// Initialize OpenSSL<br />
                          &nbsp;&nbsp;SSL_library_init();<br />
                          &nbsp;&nbsp;SSL_load_error_strings();<br />
                          &nbsp;&nbsp;OpenSSL_add_all_algorithms();<br />
                          <br />
                          &nbsp;&nbsp;// Create a new SSL_CTX with TLS 1.3<br />
                          &nbsp;&nbsp;SSL_CTX* ctx = SSL_CTX_new(TLS_method());<br />
                          <br />
                          &nbsp;&nbsp;// Set minimum TLS version to 1.2<br />
                          &nbsp;&nbsp;SSL_CTX_set_min_proto_version(ctx, TLS1_2_VERSION);<br />
                          <br />
                          &nbsp;&nbsp;// Set secure cipher list<br />
                          &nbsp;&nbsp;SSL_CTX_set_cipher_list(ctx, "HIGH:!aNULL:!kRSA:!PSK:!SRP:!MD5:!RC4");<br />
                          <br />
                          &nbsp;&nbsp;// Enable certificate verification<br />
                          &nbsp;&nbsp;SSL_CTX_set_verify(ctx, SSL_VERIFY_PEER | SSL_VERIFY_FAIL_IF_NO_PEER_CERT, NULL);<br />
                          }
                        </div>
                      </>
                    ) : library.name === "BouncyCastle" ? (
                      <>
                        <div className="text-slate-500">// Secure BouncyCastle implementation for password hashing</div>
                        <div className="text-green-400">
                          import org.bouncycastle.crypto.generators.Argon2BytesGenerator;<br />
                          import org.bouncycastle.crypto.params.Argon2Parameters;<br />
                          <br />
                          public class SecurePasswordHasher {<br />
                          &nbsp;&nbsp;private static final int SALT_LENGTH = 16;<br />
                          &nbsp;&nbsp;private static final int HASH_LENGTH = 32;<br />
                          <br />
                          &nbsp;&nbsp;public static byte[] hashPassword(char[] password, byte[] salt) {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;// Configure Argon2 parameters (memory, iterations, parallelism)<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;Argon2Parameters.Builder builder = new Argon2Parameters.Builder(Argon2Parameters.ARGON2_id)<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.withSalt(salt)<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.withMemoryAsKB(65536) // 64 MB<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.withIterations(3)<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.withParallelism(4);<br />
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;Argon2BytesGenerator generator = new Argon2BytesGenerator();<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;generator.init(builder.build());<br />
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;byte[] result = new byte[HASH_LENGTH];<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;generator.generateBytes(password, result, 0, result.length);<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;return result;<br />
                          &nbsp;&nbsp;}<br />
                          }
                        </div>
                      </>
                    ) : library.name === "PyCA/cryptography" ? (
                      <>
                        <div className="text-slate-500"># Secure PyCA/cryptography implementation for encryption</div>
                        <div className="text-green-400">
                          from cryptography.hazmat.primitives.ciphers.aead import AESGCM<br />
                          import os<br />
                          <br />
                          def encrypt_data(data, key=None):<br />
                          &nbsp;&nbsp;# Generate a key if not provided<br />
                          &nbsp;&nbsp;if key is None:<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;key = AESGCM.generate_key(bit_length=256)<br />
                          <br />
                          &nbsp;&nbsp;# Create an AES-GCM cipher with the key<br />
                          &nbsp;&nbsp;aesgcm = AESGCM(key)<br />
                          <br />
                          &nbsp;&nbsp;# Generate a random nonce<br />
                          &nbsp;&nbsp;nonce = os.urandom(12)<br />
                          <br />
                          &nbsp;&nbsp;# Encrypt the data<br />
                          &nbsp;&nbsp;ciphertext = aesgcm.encrypt(nonce, data, None)<br />
                          <br />
                          &nbsp;&nbsp;# Return the nonce and ciphertext<br />
                          &nbsp;&nbsp;return {"{"} 'nonce': nonce, 'ciphertext': ciphertext, 'key': key {"}"}<br />
                          <br />
                          def decrypt_data(nonce, ciphertext, key):<br />
                          &nbsp;&nbsp;aesgcm = AESGCM(key)<br />
                          &nbsp;&nbsp;return aesgcm.decrypt(nonce, ciphertext, None)
                        </div>
                      </>
                    ) : library.name === "Node-Forge" ? (
                      <>
                        <div className="text-slate-500">// Secure Node-Forge implementation for RSA encryption</div>
                        <div className="text-green-400">
                          const forge = require('node-forge');<br />
                          <br />
                          // Generate a secure RSA key pair<br />
                          function generateKeyPair() {<br />
                          &nbsp;&nbsp;return new Promise((resolve, reject) => {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;// Generate a 4096-bit RSA key pair with secure defaults<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;forge.pki.rsa.generateKeyPair({"{"} bits: 4096 {"}"}, (err, keyPair) => {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (err) {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;reject(err);<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return;<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br />
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Convert to PEM format<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);<br />
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolve({"{"} privateKey: privateKeyPem, publicKey: publicKeyPem {"}"});<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;});<br />
                          &nbsp;&nbsp;});<br />
                          }<br />
                          <br />
                          // Encrypt data with RSA-OAEP and SHA-256<br />
                          function encryptData(publicKeyPem, data) {<br />
                          &nbsp;&nbsp;const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);<br />
                          &nbsp;&nbsp;const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;md: forge.md.sha256.create()<br />
                          &nbsp;&nbsp;});<br />
                          &nbsp;&nbsp;return forge.util.encode64(encrypted);<br />
                          }
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-slate-500">// Secure WolfSSL implementation</div>
                        <div className="text-green-400">
                          #include &lt;wolfssl/ssl.h&gt;<br />
                          <br />
                          int initialize_wolfssl() {<br />
                          &nbsp;&nbsp;// Initialize wolfSSL<br />
                          &nbsp;&nbsp;wolfSSL_Init();<br />
                          <br />
                          &nbsp;&nbsp;// Create a new context<br />
                          &nbsp;&nbsp;WOLFSSL_CTX* ctx = wolfSSL_CTX_new(wolfTLSv1_3_client_method());<br />
                          &nbsp;&nbsp;if (ctx == NULL) {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;return -1;<br />
                          &nbsp;&nbsp;}<br />
                          <br />
                          &nbsp;&nbsp;// Load CA certificates<br />
                          &nbsp;&nbsp;if (wolfSSL_CTX_load_verify_locations(ctx, "ca-cert.pem", 0) != SSL_SUCCESS) {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;wolfSSL_CTX_free(ctx);<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;return -1;<br />
                          &nbsp;&nbsp;}<br />
                          <br />
                          &nbsp;&nbsp;// Enable certificate verification<br />
                          &nbsp;&nbsp;wolfSSL_CTX_set_verify(ctx, SSL_VERIFY_PEER, 0);<br />
                          <br />
                          &nbsp;&nbsp;return 0;<br />
                          }
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="insecure">
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {library.name === "OpenSSL" ? (
                      <>
                        <div className="text-slate-500">// Insecure OpenSSL implementation - DO NOT USE</div>
                        <div className="text-red-400">
                          #include &lt;openssl/ssl.h&gt;<br />
                          <br />
                          void initialize_ssl_insecure() {<br />
                          &nbsp;&nbsp;// Initialize OpenSSL<br />
                          &nbsp;&nbsp;SSL_library_init();<br />
                          <br />
                          &nbsp;&nbsp;// Create a new SSL_CTX with SSLv3 (insecure)<br />
                          &nbsp;&nbsp;SSL_CTX* ctx = SSL_CTX_new(SSLv3_method());<br />
                          <br />
                          &nbsp;&nbsp;// Disable certificate verification (INSECURE)<br />
                          &nbsp;&nbsp;SSL_CTX_set_verify(ctx, SSL_VERIFY_NONE, NULL);<br />
                          <br />
                          &nbsp;&nbsp;// Allow weak ciphers (INSECURE)<br />
                          &nbsp;&nbsp;SSL_CTX_set_cipher_list(ctx, "ALL");<br />
                          }
                        </div>
                      </>
                    ) : library.name === "BouncyCastle" ? (
                      <>
                        <div className="text-slate-500">// Insecure BouncyCastle implementation - DO NOT USE</div>
                        <div className="text-red-400">
                          import org.bouncycastle.crypto.digests.MD5Digest;<br />
                          import org.bouncycastle.util.encoders.Hex;<br />
                          <br />
                          public class InsecurePasswordHasher {<br />
                          &nbsp;&nbsp;// Using MD5 for password hashing (INSECURE)<br />
                          &nbsp;&nbsp;public static String hashPassword(String password) {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;MD5Digest digest = new MD5Digest();<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;byte[] passwordBytes = password.getBytes();<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;digest.update(passwordBytes, 0, passwordBytes.length);<br />
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;byte[] result = new byte[digest.getDigestSize()];<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;digest.doFinal(result, 0);<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;return Hex.toHexString(result);<br />
                          &nbsp;&nbsp;}<br />
                          }
                        </div>
                      </>
                    ) : library.name === "PyCA/cryptography" ? (
                      <>
                        <div className="text-slate-500"># Insecure PyCA/cryptography implementation - DO NOT USE</div>
                        <div className="text-red-400">
                          from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes<br />
                          <br />
                          def encrypt_data_insecure(data, key):<br />
                          &nbsp;&nbsp;# Using ECB mode (INSECURE)<br />
                          &nbsp;&nbsp;cipher = Cipher(algorithms.AES(key), modes.ECB())<br />
                          &nbsp;&nbsp;encryptor = cipher.encryptor()<br />
                          <br />
                          &nbsp;&nbsp;# Pad data to block size (insecure padding)<br />
                          &nbsp;&nbsp;block_size = 16<br />
                          &nbsp;&nbsp;padding_length = block_size - (len(data) % block_size)<br />
                          &nbsp;&nbsp;padded_data = data + bytes([padding_length] * padding_length)<br />
                          <br />
                          &nbsp;&nbsp;# Encrypt without authentication<br />
                          &nbsp;&nbsp;return encryptor.update(padded_data) + encryptor.finalize()
                        </div>
                      </>
                    ) : library.name === "Node-Forge" ? (
                      <>
                        <div className="text-slate-500">// Insecure Node-Forge implementation - DO NOT USE</div>
                        <div className="text-red-400">
                          const forge = require('node-forge');<br />
                          <br />
                          // Generate a weak RSA key pair<br />
                          function generateWeakKeyPair() {<br />
                          &nbsp;&nbsp;return new Promise((resolve, reject) => {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;// 1024-bit keys are too weak for modern security<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;forge.pki.rsa.generateKeyPair({"{"} bits: 1024 {"}"}, (err, keyPair) => {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (err) {<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;reject(err);<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return;<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br />
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;resolve(keyPair);<br />
                          &nbsp;&nbsp;&nbsp;&nbsp;});<br />
                          &nbsp;&nbsp;});<br />
                          }<br />
                          <br />
                          // Encrypt with PKCS#1 v1.5 padding (vulnerable to attacks)<br />
                          function encryptDataInsecure(publicKey, data) {<br />
                          &nbsp;&nbsp;return publicKey.encrypt(data, 'RSAES-PKCS1-V1_5');<br />
                          }
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-slate-500">// Insecure WolfSSL implementation - DO NOT USE</div>
                        <div className="text-red-400">
                          #include &lt;wolfssl/ssl.h&gt;<br />
                          <br />
                          int initialize_wolfssl_insecure() {<br />
                          &nbsp;&nbsp;// Initialize wolfSSL<br />
                          &nbsp;&nbsp;wolfSSL_Init();<br />
                          <br />
                          &nbsp;&nbsp;// Create a new context with TLSv1.0 (outdated)<br />
                          &nbsp;&nbsp;WOLFSSL_CTX* ctx = wolfSSL_CTX_new(wolfTLSv1_client_method());<br />
                          <br />
                          &nbsp;&nbsp;// Disable certificate verification (INSECURE)<br />
                          &nbsp;&nbsp;wolfSSL_CTX_set_verify(ctx, SSL_VERIFY_NONE, 0);<br />
                          <br />
                          &nbsp;&nbsp;return 0;<br />
                          }
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="migration">
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    {library.name === "OpenSSL" ? (
                      <>
                        <div className="text-slate-500">// Migration guide from OpenSSL 1.0.2k to 3.1.0</div>
                        <div className="text-blue-400">
                          /*<br />
                          * Step 1: Update your package manager<br />
                          * Ubuntu/Debian: sudo apt update && sudo apt install openssl<br />
                          * CentOS/RHEL: sudo yum update openssl<br />
                          *<br />
                          * Step 2: Update API calls that have changed<br />
                          */<br />
                          <br />
                          // Old code (1.0.2k)<br />
                          SSL_CTX* ctx = SSL_CTX_new(TLSv1_2_method());<br />
                          <br />
                          // New code (3.1.0)<br />
                          SSL_CTX* ctx = SSL_CTX_new(TLS_method());<br />
                          SSL_CTX_set_min_proto_version(ctx, TLS1_2_VERSION);<br />
                          <br />
                          // Old code (1.0.2k)<br />
                          SSL_CTX_set_cipher_list(ctx, "HIGH:!aNULL:!MD5");<br />
                          <br />
                          // New code (3.1.0)<br />
                          SSL_CTX_set_ciphersuites(ctx, "TLS_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256");<br />
                          SSL_CTX_set_cipher_list(ctx, "HIGH:!aNULL:!kRSA:!PSK:!SRP:!MD5:!RC4");
                        </div>
                      </>
                    ) : library.name === "BouncyCastle" ? (
                      <>
                        <div className="text-slate-500">// Migration guide from BouncyCastle 1.68 to 1.70</div>
                        <div className="text-blue-400">
                          /*<br />
                          * Step 1: Update your dependency<br />
                          * Maven:<br />
                          * &lt;dependency&gt;<br />
                          *   &lt;groupId&gt;org.bouncycastle&lt;/groupId&gt;<br />
                          *   &lt;artifactId&gt;bcprov-jdk15on&lt;/artifactId&gt;<br />
                          *   &lt;version&gt;1.70&lt;/version&gt;<br />
                          * &lt;/dependency&gt;<br />
                          *<br />
                          * Gradle:<br />
                          * implementation 'org.bouncycastle:bcprov-jdk15on:1.70'<br />
                          */<br />
                          <br />
                          // Old code (1.68) - Using SHA-1 (weak)<br />
                          import org.bouncycastle.crypto.digests.SHA1Digest;<br />
                          import org.bouncycastle.crypto.generators.PKCS5S2ParametersGenerator;<br />
                          import org.bouncycastle.crypto.params.KeyParameter;<br />
                          <br />
                          PKCS5S2ParametersGenerator gen = new PKCS5S2ParametersGenerator(new SHA1Digest());<br />
                          gen.init(password, salt, iterations);<br />
                          KeyParameter key = (KeyParameter) gen.generateDerivedParameters(keySize);<br />
                          <br />
                          // New code (1.70) - Using SHA-256 or Argon2<br />
                          import org.bouncycastle.crypto.digests.SHA256Digest;<br />
                          import org.bouncycastle.crypto.generators.PKCS5S2ParametersGenerator;<br />
                          import org.bouncycastle.crypto.params.KeyParameter;<br />
                          <br />
                          PKCS5S2ParametersGenerator gen = new PKCS5S2ParametersGenerator(new SHA256Digest());<br />
                          gen.init(password, salt, iterations);<br />
                          KeyParameter key = (KeyParameter) gen.generateDerivedParameters(keySize);
                        </div>
                      </>
                    ) : library.name === "PyCA/cryptography" ? (
                      <>
                        <div className="text-slate-500"># Migration guide from PyCA/cryptography 3.4.6 to 39.0.1</div>
                        <div className="text-blue-400">
                          """<br />
                          Step 1: Update your package<br />
                          pip install cryptography==39.0.1<br />
                          <br />
                          Step 2: Update deprecated APIs<br />
                          """<br />
                          <br />
                          # Old code (3.4.6) - Using CBC mode with manual padding<br />
                          from cryptography.haz

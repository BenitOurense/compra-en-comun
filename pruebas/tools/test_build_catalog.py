import io,json,tempfile,unittest,hashlib,subprocess,sys
from pathlib import Path
import build_catalog as b
class CatalogTests(unittest.TestCase):
    def row(self,**values):return {'code':'7622210204424','product_name':'Producto de prueba','countries_tags':'en:spain','allergens':'en:milk','traces':'en:nuts','categories_tags':'en:biscuits',**values}
    def test_country_and_code_validation(self):
        self.assertIsNotNone(b.compact(self.row()))
        self.assertIsNone(b.compact(self.row(countries_tags='en:france')))
        self.assertIsNone(b.compact(self.row(code='123')))
    def test_terms_and_allergens_are_preserved(self):
        p=b.compact(self.row());self.assertIn('galletas',p['terms']);self.assertEqual(p['allergens'],'en:milk');self.assertEqual(p['traces'],'en:nuts')
    def test_no_fabricated_or_untrusted_photograph(self):
        self.assertEqual(b.compact(self.row())['image'],'')
        self.assertEqual(b.compact(self.row(image_front_small_url='https://example.org/photo.png'))['image'],'')
    def test_csv_export_field_names_for_images_and_allergens(self):
        url='https://images.openfoodfacts.org/images/products/762/221/020/4424/front_es.157.200.jpg'
        p=b.compact(self.row(allergens='',allergens_en='Milk',image_small_url=url));self.assertEqual(p['image'],url);self.assertEqual(p['allergens'],'Milk')
    def test_generated_manifest_matches_shards(self):
        with tempfile.TemporaryDirectory() as t:
            p=b.compact(self.row());m=b.write_catalog([p],Path(t)/'catalogue',{'capturedAt':'2026-01-01T00:00:00Z'})
            raw=(Path(t)/'catalogue'/m['shards'][0]['path']).read_bytes();self.assertEqual(hashlib.sha256(raw).hexdigest(),m['shards'][0]['sha256']);self.assertEqual(m['count'],1)
    def test_invalid_input_does_not_replace_existing_catalogue(self):
        with tempfile.TemporaryDirectory() as t:
            folder=Path(t)/'catalogue';b.write_catalog([b.compact(self.row())],folder,{'capturedAt':'2026-01-01T00:00:00Z'});old=(folder/'manifest.json').read_bytes();invalid=Path(t)/'bad.tsv';invalid.write_text('unexpected\tcolumn\nwrong\tdata\n')
            result=subprocess.run([sys.executable,str(Path(b.__file__)), '--input',str(invalid),'--output',str(folder),'--min-products','1'],capture_output=True)
            self.assertNotEqual(result.returncode,0);self.assertEqual((folder/'manifest.json').read_bytes(),old)
if __name__=='__main__':unittest.main()

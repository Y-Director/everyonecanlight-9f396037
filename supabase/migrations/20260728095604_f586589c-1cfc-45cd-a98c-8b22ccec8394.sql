CREATE TABLE public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  manufacturer text NOT NULL DEFAULT 'Generic',
  category text NOT NULL DEFAULT 'Other',
  serial_number text,
  location text NOT NULL DEFAULT 'in_store',
  status text NOT NULL DEFAULT 'good',
  notes text,
  date_added date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_items TO authenticated;
GRANT ALL ON public.inventory_items TO service_role;

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages inventory"
  ON public.inventory_items FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Inventory admins can view inventory"
  ON public.inventory_items FOR SELECT TO authenticated
  USING (app_private.is_super_admin(auth.uid()) OR app_private.admin_has_section(auth.uid(), 'inventory'));

CREATE POLICY "Inventory admins can insert inventory"
  ON public.inventory_items FOR INSERT TO authenticated
  WITH CHECK (app_private.is_super_admin(auth.uid()) OR app_private.admin_has_section(auth.uid(), 'inventory'));

CREATE POLICY "Inventory admins can update inventory"
  ON public.inventory_items FOR UPDATE TO authenticated
  USING (app_private.is_super_admin(auth.uid()) OR app_private.admin_has_section(auth.uid(), 'inventory'))
  WITH CHECK (app_private.is_super_admin(auth.uid()) OR app_private.admin_has_section(auth.uid(), 'inventory'));

CREATE POLICY "Inventory admins can delete inventory"
  ON public.inventory_items FOR DELETE TO authenticated
  USING (app_private.is_super_admin(auth.uid()) OR app_private.admin_has_section(auth.uid(), 'inventory'));

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX inventory_items_group_idx ON public.inventory_items (manufacturer, name);